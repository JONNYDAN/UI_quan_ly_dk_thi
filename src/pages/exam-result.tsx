import { CONFIG } from 'src/config-global';

import { ExamResultView } from 'src/sections/exam/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Kết quả thi - ${CONFIG.appName}`}</title>

      <ExamResultView />
    </>
  );
}
