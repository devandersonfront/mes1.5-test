# monorepo 구성

```

main - mes의 page 담당
basic - 기준 정보 관리를 구성하고 있음
mes - mes의 container 담당
shared - 재사용하는 컴포넌트나 column의 관련된 파일을 담당
    
```



### `Linux 배포시`
<span style="color:red">dependency 오류 시 npm config set legacy-peer-deps true 후 npm install</span>

    AWS 접속 및 node, npm 설치
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

    
    


