export type Status = 'published' | 'draft' | 'archived';
export type ContentKind = '일반 가이드' | '현장 기록' | '검증 메모';

export type Category = {
  slug: string; name: string; eyebrow: string; description: string; questions: string[]; color: string;
};
export type Post = {
  id: string; slug: string; title: string; excerpt: string; category: string; kind: ContentKind;
  status: Status; publishedAt: string; publishedAtIso?: string; revisedAt?: string; readingTime: string; tags: string[];
  summary: string[]; toc: string[]; body: { heading: string; paragraphs: string[] }[];
  mistakes: string[]; checklist: string[]; related: string[]; featured?: boolean;
};
export type Column = { id: string; slug: string; title: string; description: string; status: Status; issue: string; body: string[]; };

export const siteConfig = {
  name: 'AI기획자로 살아남기',
  shortName: 'AI기획자',
  description: 'AI로 작은 앱과 콘텐츠를 만드는 직장인, 초기 1인 운영자를 위한 정직한 현장 기록.',
  email: 'trend_curation@naver.com',
  operator: 'Trenqura',
};

export const categories: Category[] = [
  { slug: 'problem', name: '문제 정의', eyebrow: '01 / 먼저 묻기', description: '무엇을 만들지보다 어떤 문제를 관찰하고, 누구의 어떤 마찰을 줄일지 정리합니다.', questions: ['이 문제는 정말 반복되는가?', '사용자 대신 내가 편해지는 것은 아닌가?', 'AI가 아니라 사람의 판단이 필요한 지점은 어디인가?'], color: '#C47A3D' },
  { slug: 'planning', name: 'AI 기획', eyebrow: '02 / 구조 잡기', description: '막연한 아이디어를 화면, 데이터, 흐름으로 번역하는 과정과 그때의 판단을 기록합니다.', questions: ['가장 작은 검증 단위는 무엇인가?', '프롬프트보다 먼저 정의할 것은 무엇인가?', '실패했을 때 되돌릴 수 있는 구조인가?'], color: '#19324D' },
  { slug: 'making', name: '만들기', eyebrow: '03 / 손으로 확인', description: '코드와 도구를 오가며 작은 결과물을 만드는 과정에서 생기는 선택과 타협을 다룹니다.', questions: ['이 기능은 지금 꼭 필요한가?', '생성된 결과를 어떻게 읽고 고칠 것인가?', '도구를 바꿀 때 잃는 맥락은 무엇인가?'], color: '#657A80' },
  { slug: 'verification', name: '검증과 운영', eyebrow: '04 / 다시 보기', description: '만들었다는 사실과 쓸 수 있다는 사실 사이를 메우는 확인, 관찰, 운영의 기술입니다.', questions: ['무엇을 보면 실패를 빨리 알 수 있는가?', '수동 확인으로 충분한 곳은 어디인가?', '기록이 다음 의사결정을 바꾸는가?'], color: '#8B6E59' },
  { slug: 'work', name: '일하는 방식', eyebrow: '05 / 오래 하기', description: '직장과 개인 실험을 함께 굴리며 에너지와 주의를 배분하는 현실적인 방법을 찾습니다.', questions: ['오늘의 속도와 다음 달의 지속성을 어떻게 맞출까?', '혼자 결정할 때 어떤 기준이 필요한가?', '멈추는 것도 운영에 포함되는가?'], color: '#A0524C' },
];

const body = (heading: string, paragraphs: string[]) => ({ heading, paragraphs });
export const posts: Post[] = [
  { id: 'p01', slug: 'ai-기획은-프롬프트보다-문제-정의에서-시작한다', title: 'AI 기획은 프롬프트보다 문제 정의에서 시작한다', excerpt: '좋은 답을 받는 기술보다 먼저 필요한 것은, 지금 해결하려는 불편을 한 문장으로 붙잡는 일이다.', category: 'problem', kind: '현장 기록', status: 'published', publishedAt: '2026.02.14', revisedAt: '2026.02.18', readingTime: '7분', tags: ['문제 정의', '기획', '프롬프트'], summary: ['AI에게 질문하기 전, 내가 무엇을 모르는지부터 적는다.', '문제의 크기를 줄이면 검증 가능한 첫 화면이 보인다.'], toc: ['문제는 요청사항과 다르다', '한 문장으로 좁히는 순서', '작은 검증으로 옮기기'], body: [body('문제는 요청사항과 다르다', ['“대시보드를 만들어 달라”는 요청은 문제의 이름이 아니다. 누군가 매주 반복해서 옮겨 적는 표가 있고, 그 시간이 아깝다는 관찰이 문제에 더 가깝다.', 'AI는 입력된 요청을 빠르게 확장한다. 그래서 요청이 흐린 상태에서는 그럴듯한 기능 목록만 늘어난다. 먼저 반복되는 행동과 그 행동의 비용을 적어야 한다.']), body('한 문장으로 좁히는 순서', ['나는 누구의 어떤 반복을 보았는가. 그 반복은 지금 어떤 불편을 만든다. 기존 방식으로는 왜 충분하지 않은가. 세 문장에 답한 뒤에야 AI에게 화면 구조를 물었다.', '이 과정은 거창한 리서치가 아니다. 지난주 메신저, 스프레드시트, 메모를 다시 읽는 일에서 시작할 수 있다.'])], mistakes: ['도구 이름을 문제처럼 말하기', '첫 답변의 기능 목록을 요구사항으로 확정하기', '사용자의 불편을 내 취향으로 대체하기'], checklist: ['반복되는 행동을 동사로 적었는가?', '사용자와 상황을 한 명, 한 장면으로 줄였는가?', '가장 작은 성공 신호를 정했는가?'], related: ['p03', 'p08'], featured: true },
  { id: 'p02', slug: '작은-앱은-기능이-아니라-확인-순서로-만든다', title: '작은 앱은 기능이 아니라 확인 순서로 만든다', excerpt: '무엇을 더 넣을지보다 무엇을 먼저 확인할지 정하면, 혼자 만드는 일의 속도가 달라진다.', category: 'planning', kind: '일반 가이드', status: 'published', publishedAt: '2026.02.10', readingTime: '6분', tags: ['MVP', '검증', '작은 앱'], summary: ['기능 목록을 검증 질문으로 바꾸면 우선순위가 선명해진다.'], toc: ['기능 목록을 질문으로 바꾸기', '세 번의 확인 순서', '멈출 기준 만들기'], body: [body('기능 목록을 질문으로 바꾸기', ['로그인, 검색, 알림이라는 기능은 그 자체로 가치가 아니다. 사용자가 다시 찾아와야 하는 이유, 찾을 수 있어야 하는 정보, 잊지 않아야 하는 약속으로 바꿔 적어 보자.']), body('세 번의 확인 순서', ['첫 번째는 흐름이 끝나는지, 두 번째는 결과를 믿을 수 있는지, 세 번째는 다시 쓸 이유가 있는지 확인한다. 각 질문에 답하지 못하면 다음 기능으로 넘어가지 않는다.'])], mistakes: ['MVP를 기능이 적은 제품으로만 이해하기', '완성도와 검증을 한 번에 해결하려 하기'], checklist: ['첫 사용 흐름이 3분 안에 끝나는가?', '실패 상태를 직접 확인했는가?', '다음 행동이 화면에 남아 있는가?'], related: ['p01', 'p06'] },
  { id: 'p03', slug: '생성된-코드를-믿지-않고-읽는-네-가지-방법', title: '생성된 코드를 믿지 않고 읽는 네 가지 방법', excerpt: 'AI가 만든 코드는 출발점이다. 작은 실험일수록 어디를 의심할지 정하는 습관이 중요하다.', category: 'verification', kind: '일반 가이드', status: 'published', publishedAt: '2026.02.04', readingTime: '8분', tags: ['코드 읽기', '검증'], summary: ['생성 속도는 이해의 속도를 대신하지 않는다.'], toc: ['경계부터 읽기', '입력과 실패를 따라가기', '작동 확인 기록'], body: [body('경계부터 읽기', ['처음 읽을 곳은 예쁜 컴포넌트가 아니다. 외부 입력을 받는 곳, 데이터를 저장하는 곳, 오류를 감추는 곳부터 본다.']), body('입력과 실패를 따라가기', ['정상적인 한 번의 클릭만으로는 충분하지 않다. 빈 값, 느린 네트워크, 예상 밖의 날짜를 넣어 보고 무엇이 화면에 남는지 적는다.'])], mistakes: ['작동 화면만 보고 검증했다고 생각하기', '에러 메시지를 사용자 문제로 떠넘기기'], checklist: ['입력 경계를 찾았는가?', '실패 상태에서 복구할 수 있는가?', '수정한 이유를 한 줄로 남겼는가?'], related: ['p05', 'p11'] },
  { id: 'p04', slug: '퇴근-후-실험을-지속시키는-작은-운영-리듬', title: '퇴근 후 실험을 지속시키는 작은 운영 리듬', excerpt: '의욕이 아니라 다음에 다시 시작하기 쉬운 흔적을 남기는 방식에 관한 기록.', category: 'work', kind: '현장 기록', status: 'published', publishedAt: '2026.01.28', readingTime: '5분', tags: ['운영', '직장인', '리듬'], summary: ['작업을 끝내는 방식이 다음 작업의 시작을 결정한다.'], toc: ['실험의 단위를 줄이기', '종료 메모', '멈춤을 일정에 넣기'], body: [body('실험의 단위를 줄이기', ['평일 저녁에 새로운 서비스를 완성하려는 계획은 자주 무너진다. 대신 한 화면의 흐름이나 하나의 데이터 형태를 확인하는 일을 한 번의 실험으로 정한다.']), body('종료 메모', ['마지막 5분에는 다음에 열 파일, 아직 모르는 것, 버려도 되는 것을 남긴다. 결과보다 재개 비용을 낮추는 기록이다.'])], mistakes: ['완료를 배포와 동일시하기', '실험마다 새로운 도구를 배우기'], checklist: ['오늘 확인할 질문이 하나인가?', '중단 지점을 미리 정했는가?', '다음 시작 메모를 남겼는가?'], related: ['p07', 'p13'] },
  { id: 'p05', slug: 'AI에게-코드-리뷰를-시킬-때-먼저-건네야-하는-것', title: 'AI에게 코드 리뷰를 시킬 때 먼저 건네야 하는 것', excerpt: '코드보다 판단 기준을 먼저 주면, 리뷰는 칭찬 목록이 아니라 확인 가능한 질문이 된다.', category: 'making', kind: '일반 가이드', status: 'published', publishedAt: '2026.01.19', readingTime: '6분', tags: ['코드 리뷰', 'AI 협업'], summary: ['리뷰의 품질은 모델보다 맥락의 품질에 좌우된다.'], toc: ['기준을 먼저 쓰기', '변경 범위 제한하기', '리뷰 결과 기록하기'], body: [body('기준을 먼저 쓰기', ['성능을 봐 달라는 말은 넓다. 느린 목록 렌더링, 중복 요청, 누락된 로딩 상태처럼 관찰 가능한 기준으로 바꾼다.']), body('변경 범위 제한하기', ['리뷰와 수정은 분리한다. 먼저 위험한 부분을 목록으로 받고, 그중 한 가지를 골라 수정한 뒤 다시 확인한다.'])], mistakes: ['리뷰와 리팩터링을 한 번에 요청하기', '도메인 규칙 없이 일반적인 모범 사례만 받기'], checklist: ['이번 리뷰의 범위를 선언했는가?', '수정 전후를 비교할 입력이 있는가?', '반드시 사람이 확인할 부분을 표시했는가?'], related: ['p03', 'p12'] },
  { id: 'p06', slug: '스프레드시트에서-작은-도구로-옮겨갈-때의-기준', title: '스프레드시트에서 작은 도구로 옮겨갈 때의 기준', excerpt: '불편하다는 느낌만으로 앱을 만들지 않기 위해, 이동의 조건을 수치보다 행동으로 정리한다.', category: 'planning', kind: '일반 가이드', status: 'published', publishedAt: '2026.01.12', readingTime: '7분', tags: ['스프레드시트', '도구 선택'], summary: ['표가 나쁜 것이 아니라, 표 바깥의 반복이 신호일 수 있다.'], toc: ['표가 아직 충분한 경우', '옮겨갈 신호', '작은 이전 계획'], body: [body('표가 아직 충분한 경우', ['한 사람이 보고, 규칙이 자주 바뀌며, 과거 기록을 거의 보지 않는다면 표가 가장 솔직한 도구일 수 있다.']), body('옮겨갈 신호', ['같은 데이터를 여러 사람이 다른 방식으로 고치거나, 실수 확인에 더 많은 시간이 들기 시작하면 작은 도구를 검토한다.'])], mistakes: ['표를 쓰는 사람을 문제로 보기', '데이터 이전부터 시작하기'], checklist: ['반복 행동을 확인했는가?', '실수의 비용을 관찰했는가?', '되돌릴 수 있는 이전인가?'], related: ['p01', 'p02'] },
  { id: 'p07', slug: '혼자-만드는-사람의-주간-회고는-무엇을-남겨야-하나', title: '혼자 만드는 사람의 주간 회고는 무엇을 남겨야 하나', excerpt: '감상이 아니라 다음 선택을 바꾸는 정보만 남기는 짧은 회고 양식.', category: 'work', kind: '일반 가이드', status: 'draft', publishedAt: '2026.02.21', readingTime: '5분', tags: ['회고', '운영'], summary: [''], toc: [], body: [], mistakes: [], checklist: [], related: [] },
  { id: 'p08', slug: '사용자-인터뷰-없이도-확인할-수-있는-것들', title: '사용자 인터뷰 없이도 확인할 수 있는 것들', excerpt: '인터뷰가 어려운 주간에도 관찰 가능한 흔적을 통해 가설을 좁히는 방법.', category: 'problem', kind: '일반 가이드', status: 'draft', publishedAt: '2026.02.20', readingTime: '6분', tags: ['관찰', '가설'], summary: [''], toc: [], body: [], mistakes: [], checklist: [], related: [] },
  { id: 'p09', slug: '프롬프트-로그를-의사결정-기록으로-바꾸기', title: '프롬프트 로그를 의사결정 기록으로 바꾸기', excerpt: '질문과 답을 쌓는 것에서, 왜 그 답을 채택했는지 남기는 것으로.', category: 'verification', kind: '일반 가이드', status: 'draft', publishedAt: '2026.02.17', readingTime: '5분', tags: ['기록', '프롬프트'], summary: [''], toc: [], body: [], mistakes: [], checklist: [], related: [] },
  { id: 'p10', slug: '만들지-않기로-결정하는-방법', title: '만들지 않기로 결정하는 방법', excerpt: '아이디어를 포기하는 것이 아니라 관찰을 더 잘하기 위한 보류 기준.', category: 'problem', kind: '현장 기록', status: 'archived', publishedAt: '2026.01.03', readingTime: '4분', tags: ['우선순위'], summary: [''], toc: [], body: [], mistakes: [], checklist: [], related: [] },
  { id: 'p11', slug: '에러-메시지를-기획-문서로-읽는-법', title: '에러 메시지를 기획 문서로 읽는 법', excerpt: '실패하는 순간 드러나는 사용자의 실제 흐름을 놓치지 않기 위해.', category: 'verification', kind: '일반 가이드', status: 'draft', publishedAt: '2026.02.02', readingTime: '6분', tags: ['에러', '사용자 경험'], summary: [''], toc: [], body: [], mistakes: [], checklist: [], related: [] },
  { id: 'p12', slug: '생성형-도구를-팀의-언어로-번역하기', title: '생성형 도구를 팀의 언어로 번역하기', excerpt: '새 도구를 소개하는 대신, 함께 결정할 기준을 만드는 방법.', category: 'making', kind: '일반 가이드', status: 'draft', publishedAt: '2026.01.30', readingTime: '7분', tags: ['협업', '도구'], summary: [''], toc: [], body: [], mistakes: [], checklist: [], related: [] },
  { id: 'p13', slug: '작은-출시-뒤에-반드시-확인할-세-가지', title: '작은 출시 뒤에 반드시 확인할 세 가지', excerpt: '공개했다는 사실을 성과로 착각하지 않기 위한 최소 관찰 목록.', category: 'work', kind: '검증 메모', status: 'draft', publishedAt: '2026.01.24', readingTime: '4분', tags: ['출시', '관찰'], summary: [''], toc: [], body: [], mistakes: [], checklist: [], related: [] },
  { id: 'p14', slug: '노코드와-코드-사이에서-결정하는-기준', title: '노코드와 코드 사이에서 결정하는 기준', excerpt: '기술의 취향이 아니라 수정 비용과 학습 비용을 함께 보는 표.', category: 'making', kind: '일반 가이드', status: 'draft', publishedAt: '2026.01.15', readingTime: '8분', tags: ['노코드', '개발'], summary: [''], toc: [], body: [], mistakes: [], checklist: [], related: [] },
  { id: 'p15', slug: '기록을-공개할-때-지켜야-할-선', title: '기록을 공개할 때 지켜야 할 선', excerpt: '정직한 현장 기록과 타인의 정보를 소비하는 이야기 사이를 구분하기.', category: 'work', kind: '일반 가이드', status: 'draft', publishedAt: '2026.01.07', readingTime: '5분', tags: ['기록', '윤리'], summary: [''], toc: [], body: [], mistakes: [], checklist: [], related: [] },
];

export const columns: Column[] = [
  { id: 'c01', slug: '퇴근-후-기획실', title: '퇴근 후 기획실', description: '직장인의 시간표 안에서 작은 실험을 굴리는 메모.', status: 'published', issue: 'Column 01', body: ['퇴근 뒤 두 시간은 새로운 사람이 되기에는 짧고, 어제의 나를 이어가기에는 충분하다.', '이 칼럼에서는 거창한 사이드 프로젝트보다 다음 주에도 다시 열 수 있는 작은 결정들을 기록한다. 도구의 이름보다 멈춘 이유를 오래 들여다본다.'] },
  { id: 'c02', slug: '검증-노트', title: '검증 노트', description: '만들었다는 말과 쓸 수 있다는 말 사이를 기록합니다.', status: 'published', issue: 'Column 02', body: ['정상적으로 작동하는 화면은 시작에 가깝다. 빈칸을 만났을 때, 기다림이 길어졌을 때, 내가 모르는 데이터가 들어왔을 때의 표정이 제품의 태도를 결정한다.', '검증 노트는 그 표정을 놓치지 않기 위한 짧은 기록이다.'] },
  { id: 'c03', slug: '보류함', title: '보류함', description: '만들지 않기로 한 것에서 배운 문제 정의의 기록.', status: 'draft', issue: 'Column 03', body: ['모든 아이디어를 실행하는 것은 운영이 아니다. 보류함에는 아직 설명할 수 없는 아이디어와, 지금 만들지 않는 편이 더 정직했던 판단을 넣는다.'] },
];

export const publishedPosts = () => posts.filter((post) => post.status === 'published');
export const getCategory = (slug: string) => categories.find((category) => category.slug === slug);
export const getPost = (slug: string, list: Post[] = posts) => list.find((post) => post.slug === slug);
export const getColumn = (slug: string, list: Column[] = columns) => list.find((column) => column.slug === slug);