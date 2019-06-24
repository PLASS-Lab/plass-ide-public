# IDE 용 rest api 서버

## 시작하기전에
해당 프로젝트는 typescript로 이루어져 있다.
typesciprt를 실행시키기 위해서는 다음과 같은 npm 모듈을 설치해야한다.
> npm install -g typescript
> npm install -g ts-node

해당 모듈을 전역으로 다운로드 후 프로젝트에서 사용하는 모듈을 다운로드한다.
> npm install

이후 실행은 다음과 같이한다.
> npm start

## 설정
해당 프로젝트는 config 파일의 설정이 필요하다.

config 파일 성장은 다음과 같다.

1. config 디렉토리를 root에 생성
2. jwt_secret_key.js를 생성한다
3. database.js를 생성한다.

### jwt_secet_key.js
이 파일의 기본 형태는 다음과 같다.
> exports.default = "secret_key_of_jwt"; 


### database.js
이 파일의 기본 형태는 다음과 같다.
> exports.default = {
    "host": "localhost",
    "user": "username",
    "password": "password",
    "database": "database_name"
};


## 모듈
해당 프로젝트는 express, mysql2 모듈을 사용한다.

mysql 사용시에 async, await 혹은 then, catch를 사용한다.
> const [rows] = await connection.execute("SELECT * FROM problems LIMIT ?, ?", [page * unit, unit]);


## Auto Hot Reload
source code가 fix와 동시에 재시작을 시키고 싶으면 nodemon 모듈이 필요하다.
> npm install -g nodemon

이후 nodemon을 다음과 같이 실행한다.
> npm run start:live


## 프로젝트 문의
동국대학교 프로젝트 팀 영구성장

팀조장 : 김민성 010-4946-9867