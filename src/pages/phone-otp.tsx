import { CONFIG } from 'src/config-global';

import { PhoneOtpView } from 'src/sections/auth';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Phone OTP - ${CONFIG.appName}`}</title>

      <PhoneOtpView />
    </>
  );
}
