import { CONFIG } from 'src/config-global';

import { ExamPaperView } from 'src/sections/exam/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Giấy báo dự thi - ${CONFIG.appName}`}</title>

      <ExamPaperView />
    </>
  );
}
