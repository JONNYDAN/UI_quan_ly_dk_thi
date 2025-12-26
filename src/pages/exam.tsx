import { CONFIG } from 'src/config-global';

import { ExamView } from 'src/sections/exam/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Products - ${CONFIG.appName}`}</title>

      <ExamView />
    </>
  );
}
