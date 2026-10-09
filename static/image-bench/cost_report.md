# 이미지 벤치 모델·비용 기록

확인일: 2026-10-09 · USD · Standard 실시간 호출

**실제 청구액이 아니라 API 응답 사용량으로 산정한 비용입니다.**

고해상도 벤치 30장: **$9.596756**. 그중 상업 18장 $5.884464, 기초 12장 $3.712292.

초기 Google 직접 테스트 2건: $0.110950. 측정 가능한 범위 합계: $9.707706.

**전체 제작 총액은 미확인입니다.** 초기 OpenAI 6건, Codex/AGY 내장 호출, 개발 에이전트 비용이 포함되지 않았습니다.

## 공식 모델 구분과 단가

Sunburst는 정밀 편집, Flare는 빠른 일상 생성에 중점을 둡니다. 두 모델의 공개 단가는 같습니다. 같은 품질 설정이어도 일반적으로 사용 토큰이 달라질 수 있으며, 이번 벤치에서는 같은 과제의 사용량이 같았습니다.

OpenAI: 텍스트 입력 $5/M, 이미지 입력 $8/M, 이미지 출력 $30/M. max 품질을 사용했습니다. 16:9는 3840×2160, 세로 문서는 2336×3504입니다.

Nano Banana 2.1: 입력 $1.50/M, 텍스트·추론 출력 $7.50/M, 이미지 출력 $30/M. 4K 이미지 출력 3780토큰=$0.1134에 입력·텍스트·추론이 추가됩니다. 16:9는 5504×3072, 문서는 3392×5056입니다.

## 이번 10과제에서 관찰한 비용·속도

| 모델 | 장수 | 총 USD | 평균 USD/장 | 평균 초/장 |
|---|---:|---:|---:|---:|
| sunburst | 10 | 4.121283 | 0.412128 | 90.7 |
| flare | 10 | 4.121283 | 0.412128 | 51.1 |
| nano21 | 10 | 1.354189 | 0.135419 | 46.5 |

각 과제 최초 결과 1장입니다. 적은 사례의 관찰이며 일반 순위나 항상 같은 가격을 보장하지 않습니다.

## 계산 방법

text_input × $5/M + image_input × $8/M + image_output × $30/M

promptTokenCount × input/M + IMAGE tokens × image_output/M + (candidatesTokenCount - IMAGE tokens + thoughtsTokenCount) × text_and_thinking_output/M

Google candidatesTokenCount에는 이미지 이외의 출력도 있으므로 IMAGE 상세를 빼고 남은 출력과 thoughtsTokenCount를 텍스트·추론 단가로 계산합니다. 총 토큰과 구성 합계의 일치 여부를 검사했습니다.

직접 Images API에서 생성·편집했으므로 캐시 할인이나 Batch 할인을 적용하지 않았습니다. 검색 grounding은 요청하지 않았습니다.

## 누락 범위

- ../openai_sunburst.png: CLI에서 토큰 사용량을 보존하지 않아 비용을 산정할 수 없습니다.
- ../openai_flare.png: CLI에서 토큰 사용량을 보존하지 않아 비용을 산정할 수 없습니다.
- ../openai_image2_api.png: CLI에서 토큰 사용량을 보존하지 않아 비용을 산정할 수 없습니다.
- ../sunburst_newkey.png: CLI에서 토큰 사용량을 보존하지 않아 비용을 산정할 수 없습니다.
- ../flare_newkey.png: CLI에서 토큰 사용량을 보존하지 않아 비용을 산정할 수 없습니다.
- ../image2_newkey.png: CLI에서 토큰 사용량을 보존하지 않아 비용을 산정할 수 없습니다.
- ../codex_builtin.png: Codex 내장 생성·에이전트의 실제 과금 정보 미확인.
- ../agy_nano_banana_2.jpg: AGY 경유 이미지·에이전트의 실제 과금 정보 미확인.
- 개발 작업: 프롬프트 조사·코드 작성·눈 검토를 수행한 개발 에이전트 비용 미확인. 로컬 OCR·정적 서버에는 외부 API 호출이 없습니다.

## 요청별 계산

| 요청 | 범위 | 산정 USD | 증거 |
|---|---|---:|---|
| 01_light_flare | basic | 0.400845 | [evidence/01_light_flare.json](evidence/01_light_flare.json) |
| 01_light_nano21 | basic | 0.124924 | [evidence/01_light_nano21.json](evidence/01_light_nano21.json) |
| 01_light_sunburst | basic | 0.400845 | [evidence/01_light_sunburst.json](evidence/01_light_sunburst.json) |
| 02_objects_flare | basic | 0.400785 | [evidence/02_objects_flare.json](evidence/02_objects_flare.json) |
| 02_objects_nano21 | basic | 0.123319 | [evidence/02_objects_nano21.json](evidence/02_objects_nano21.json) |
| 02_objects_sunburst | basic | 0.400785 | [evidence/02_objects_sunburst.json](evidence/02_objects_sunburst.json) |
| 03_poster_flare | basic | 0.400885 | [evidence/03_poster_flare.json](evidence/03_poster_flare.json) |
| 03_poster_nano21 | basic | 0.127799 | [evidence/03_poster_nano21.json](evidence/03_poster_nano21.json) |
| 03_poster_sunburst | basic | 0.400885 | [evidence/03_poster_sunburst.json](evidence/03_poster_sunburst.json) |
| 04_hands_flare | basic | 0.400775 | [evidence/04_hands_flare.json](evidence/04_hands_flare.json) |
| 04_hands_nano21 | basic | 0.129669 | [evidence/04_hands_nano21.json](evidence/04_hands_nano21.json) |
| 04_hands_sunburst | basic | 0.400775 | [evidence/04_hands_sunburst.json](evidence/04_hands_sunburst.json) |
| 05_menu_flare | commercial | 0.405230 | [commercial/evidence/05_menu_flare.json](commercial/evidence/05_menu_flare.json) |
| 05_menu_nano21 | commercial | 0.149877 | [commercial/evidence/05_menu_nano21.json](commercial/evidence/05_menu_nano21.json) |
| 05_menu_sunburst | commercial | 0.405230 | [commercial/evidence/05_menu_sunburst.json](commercial/evidence/05_menu_sunburst.json) |
| 06_document_flare | commercial | 0.473085 | [commercial/evidence/06_document_flare.json](commercial/evidence/06_document_flare.json) |
| 06_document_nano21 | commercial | 0.144268 | [commercial/evidence/06_document_nano21.json](commercial/evidence/06_document_nano21.json) |
| 06_document_sunburst | commercial | 0.473085 | [commercial/evidence/06_document_sunburst.json](commercial/evidence/06_document_sunburst.json) |
| 07_package_flare | commercial | 0.402675 | [commercial/evidence/07_package_flare.json](commercial/evidence/07_package_flare.json) |
| 07_package_nano21 | commercial | 0.137029 | [commercial/evidence/07_package_nano21.json](commercial/evidence/07_package_nano21.json) |
| 07_package_sunburst | commercial | 0.402675 | [commercial/evidence/07_package_sunburst.json](commercial/evidence/07_package_sunburst.json) |
| 08_character_flare | commercial | 0.403500 | [commercial/evidence/08_character_flare.json](commercial/evidence/08_character_flare.json) |
| 08_character_nano21 | commercial | 0.145374 | [commercial/evidence/08_character_nano21.json](commercial/evidence/08_character_nano21.json) |
| 08_character_sunburst | commercial | 0.403500 | [commercial/evidence/08_character_sunburst.json](commercial/evidence/08_character_sunburst.json) |
| 09_comic_flare | commercial | 0.417104 | [commercial/evidence/09_comic_flare.json](commercial/evidence/09_comic_flare.json) |
| 09_comic_nano21 | commercial | 0.130989 | [commercial/evidence/09_comic_nano21.json](commercial/evidence/09_comic_nano21.json) |
| 09_comic_sunburst | commercial | 0.417104 | [commercial/evidence/09_comic_sunburst.json](commercial/evidence/09_comic_sunburst.json) |
| 10_storybook_flare | commercial | 0.416399 | [commercial/evidence/10_storybook_flare.json](commercial/evidence/10_storybook_flare.json) |
| 10_storybook_nano21 | commercial | 0.140940 | [commercial/evidence/10_storybook_nano21.json](commercial/evidence/10_storybook_nano21.json) |
| 10_storybook_sunburst | commercial | 0.416399 | [commercial/evidence/10_storybook_sunburst.json](commercial/evidence/10_storybook_sunburst.json) |
| google_nano21_newkey_api_1.jpg | initial_tests | 0.042854 | [../api_newkey_test_evidence.json](../api_newkey_test_evidence.json) |
| google_nano2_newkey_api_1.jpg | initial_tests | 0.068097 | [../api_newkey_test_evidence.json](../api_newkey_test_evidence.json) |

## 확인한 공식 자료

- [Sunburst 공식 모델·가격](https://developers.openai.com/api/docs/models/gpt-image-2.5-sunburst)
- [Flare 공식 모델·가격](https://developers.openai.com/api/docs/models/gpt-image-2.5-flare)
- [OpenAI 모델 선택 안내](https://developers.openai.com/api/docs/guides/image-generation)
- [Google 공식 가격](https://ai.google.dev/gemini-api/docs/pricing)
- [Nano Banana 2.1 공식 모델](https://ai.google.dev/gemini-api/docs/models/gemini-nano-banana-2.1)
