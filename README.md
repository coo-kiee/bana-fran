# 바나프레소 가맹점

`가맹점` 점주 홈페이지

## **프로젝트 설명**

### `도메인`

- 프로덕션 도메인
  - [https://store.banapresso.com](https://store.banapresso.com)

### `Git Server`

- ssh://git@211.233.22.75:9999/home/git/repo/bana_fran_site.git (branch master)

### `배포 서버`

- `211.233.43.166`
  > /home/logiwww/banapresso_com/html/ra/franchisee
- `211.233.43.167`
  > /home/logiwww/banapresso_com/html/ra/franchisee

### `.env`

- #### `.development`
   - REACT_APP_SERVER_DOMAIN=
   - GENERATE_SOURCEMAP = true
   - REACT_APP_MODE=dev

- #### `.production`
   - PUBLIC_URL = /
   - REACT_APP_SERVER_DOMAIN=
   - GENERATE_SOURCEMAP = false
   - REACT_APP_MODE=