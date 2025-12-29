import { CONFIG } from 'src/config-global';

import { ExamInfoView } from 'src/sections/exam/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Kết quả đăng ký - ${CONFIG.appName}`}</title>

      <ExamInfoView />
    </>
  );
}
