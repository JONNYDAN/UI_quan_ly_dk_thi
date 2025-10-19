import { CONFIG } from 'src/config-global';

import { RegisterDgnlView } from 'src/sections/registerDgnl/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Products - ${CONFIG.appName}`}</title>

      <RegisterDgnlView />
    </>
  );
}
