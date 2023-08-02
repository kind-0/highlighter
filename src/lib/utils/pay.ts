import { requestProvider, type SendPaymentResponse } from 'webln';
import { openModal } from 'svelte-modals'
import LightningInvoiceModal from '../modals/Bolt11.svelte';

export async function pay(paymentRequest: string): Promise<SendPaymentResponse|null> {
    const webln = await requestProvider()

    if (webln) {
        try {
            const res = await webln.sendPayment(paymentRequest);
            console.log({res});
            return res;
        } catch (e) {
            console.log('error', e)
            if (e?.message === 'User rejected') {
                return null;
            } else {
                openModal(LightningInvoiceModal, { paymentRequest })
            }
        }
    } else {
        openModal(LightningInvoiceModal, { paymentRequest })
    }

    return null;
}