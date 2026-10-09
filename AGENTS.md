# AGENTS.md

설코딩 블로그(`blog.seolcoding.com`) 원본이다. 정본 규칙은 `~/900_System/AGENTS.md`, 관련 저장소 관계는 `~/100_Dev/seolcoding-agent-os/AGENTS.md`를 따른다.

## 만드는 법

- 글 쓰기: `hugo new content posts/<영문-슬러그>/index.md` → 같은 폴더에 이미지. 큰 파일은 R2(`https://files.seolcoding.com/`).
- 미리 보기: `hugo server` → <http://localhost:1313/>
- 형광펜은 `==글자==`, 콜아웃은 `> [!tip]`. 기울임(`*글자*`)은 칠하지 않는다.
- 배포: `main`에 push하면 GitHub Actions가 Cloudflare Pages 프로젝트 `seolcoding-blog`로 올린다. push 전에 사용자 승인을 받는다.

## 디자인

- 테마는 PaperMod(`themes/PaperMod`, git 서브모듈). 서브모듈은 고치지 않는다.
- 디자인은 툴킷 `skills/seolcoding-design`이 원본이다. `static/seolcoding/`은 거기서 복사한 것이니 여기서 고치지 말고 원본을 고친 뒤 다시 복사한다.
- PaperMod 변수와 설코딩 변수 연결은 `assets/css/extended/seolcoding.css` 한 파일에 있다.
