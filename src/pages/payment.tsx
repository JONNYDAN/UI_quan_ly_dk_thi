import { CONFIG } from 'src/config-global';

import { PaymentDetailView } from 'src/sections/payment/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Users - ${CONFIG.appName}`}</title>

      <PaymentDetailView />
    </>
  );
}
