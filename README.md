Wayne Security System

Sistema de gerenciamento de segurança para industrias Wayne. 
Inclui autenticação JWT, cadastro e controle de usuário, gerenciamento de recursos,registro de logs, frontend web.

Links de acesso:
Backend(api): https://projeto-wayne-security-system.onrender.com 
Frontend(web): https://projeto-wayne-security-syste-git-3a13ed-lacerdafelipes-projects.vercel.app 

Tecnologias utilizadas:
Backend:
Python;
Flask;
Flask-JWT-Extended;
Flask-Migrate;
Flask-CORS;
SQLite;
Gunicorn (deploy);

Frontend:
HTML5;
CSS3;
JavaScript;
API REST;

Estrutura do projeto
Projeto-Wayne-security-system/
 backend/
  ├── app/
  ├── migrations/
  ├── requirements.txt
  ├── venv
  ├── env
  ├── migrate
  ├── run.py
 
├── frontend/
 ├── login.html
 ├── dashboard.html
 ├── users.html
 ├── resources.html
 ├── css/
 └── js/

└── README.md
└── render.yaml


Observações: 
Durante o processo de publicação do backend na plataforma Render, ocorreu uma falha relacionada á execução do servido Gunicorn.
A configuração do Root no painel do Render estava incorreta. Como resultado, o sistema tentou executar os comandos de instalação da pasta mas não encontrava o arquivo requiriments.txt.
Como esse erro está diretamente relacionado ao deploy do backend, resultou em erro no frontend ao listar os usuários.

Usuário de teste. Pra facilitar a avaliação:
Usuário:admin@wayne.com
senha:123456

Feito por Felipe Lacerda Barbosa  
Projeto desenvolvido Fullstack 2025






