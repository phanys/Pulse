CREATE TYPE tipo_sanguineo_enum AS ENUM ('A+','A-','B+','B-','AB+','AB-','O+','O-');
CREATE TYPE status_aprovacao_enum AS ENUM ('pendente','aprovado','reprovado');

CREATE TABLE administradores (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL
);

CREATE TABLE hospitais (
  id SERIAL PRIMARY KEY,
  nome_fantasia VARCHAR(150) NOT NULL,
  razao_social VARCHAR(150) NOT NULL,
  cnpj VARCHAR(18) NOT NULL UNIQUE,
  endereco VARCHAR(200) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  status_aprovacao status_aprovacao_enum NOT NULL DEFAULT 'pendente',
  administrador_id INTEGER REFERENCES administradores(id),
  data_cadastro TIMESTAMP NOT NULL DEFAULT now(),
  data_aprovacao TIMESTAMP
);

CREATE TABLE doadores (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  carteirinha VARCHAR(30) UNIQUE,
  tipo_sanguineo tipo_sanguineo_enum NOT NULL,
  disponivel BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE consultas (
  id SERIAL PRIMARY KEY,
  hospital_id INTEGER NOT NULL REFERENCES hospitais(id),
  doador_id INTEGER NOT NULL REFERENCES doadores(id),
  data_consulta TIMESTAMP NOT NULL DEFAULT now()
);
