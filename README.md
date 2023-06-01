# 1.코드 구성

### `Version`
+ REACT : REACT 18
+ NEXT : NEXT 12

# monorepo 구성

```

main - mes의 page 담당
basic - 기준 정보 관리를 구성하고 있음
mes - mes의 container 담당
shared - 재사용하는 컴포넌트나 column의 관련된 파일을 담당    

```

# 2.실행 및 배포 방법

## 2.1 업체 서버의 폴더 구성 

+ MES_CLOUD (MES)
+ MES_CLOUD_AI (MES AI) ❖ 같은 MES_CLOUD repo를 사용하지만 .env.local에 선언된 값이 다름
+ [sizl-pms-mes-vhost2 (PROXY,PMS,PMS AI)](https://github.com/SIZLcorp/sizl-proxy-vhost)

## 2.2 .env 파일 구성

### 환경변수

+ prod : packages/main/.env.production
+ dev : packages/main/.env.development
+ local : packages/main/.env.local

### 우선순위
    .env.local > .env.development
    .env.local > .env.production

### 설정방법

    접두사 'NEXT_PUBLIC_' 를 붙여서 변수 선언
    NEXT_PUBLIC_SF_ADDRESS= 백엔드 api 주소
    NEXT_PUBLIC_SF_AI_ADDRESS = ai api 주소
    NEXT_PUBLIC_SF_ENDPOINT_S3= s3 api 주소
    NEXT_PUBLIC_SF_ENDPOINT_PMS= pms api 주소
    NEXT_PUBLIC_SF_ENDPOINT_PMS_PORT= pms api 포트 주소
    NEXT_PUBLIC_SF_ENDPOINT_EXCEL= excel api 주소
    NEXT_PUBLIC_SF_ENDPOINT_EXCEL_PORT= excel api 포트 주소 
    NEXT_PUBLIC_CUSTOM_TARGET= 커스텀 대상 회사 키 또는 'ai' 를 입력시 ai로 변경됨 
    NEXT_PUBLIC_NOTICE_ADDRESS = 공지사항 Page의 Notion 주소

### `Linux 배포시`

### `Version`
+ Node : v16.19.1
+ NPM : v8.19.3
+ NVM => n : v8.0.1
+ YARN : v1.22.17

***
 
    AWS 접속 및 node, npm , yarn , forever 설치 
    npm install next
    npm install lerna -global
    git clone 후 npm install --force or npm install
    lerna bootstrap
    yarn run build
    cd packages/main
    forever start -c "npx next start -p 8030" ./


### `Linux 코드 변경시`
    
    git fetch (remote 주소) (브런치)
    git merge (remote 주소) (브런치)
    yarn run build
    cd packages/main
    netstat -tnpl
    8030 port를 kill (PID번호)
    netstat -tnpl 시 port 8030의 PID 변경 확인 후 웹 확인


dependency 오류 시 해결방법
(첫번쨰 방법 안될시 두번째 방법으로 해결 )

<span style="color:red">첫번째, npm config set legacy-peer-deps true 후 npm install</span> </br>
<span style="color:red">두번쨰, ~/.npmrc -> legacy-peer-deps = true</span>




    
    


