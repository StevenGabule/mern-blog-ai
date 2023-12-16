import {PaymentElement, useStripe, useElements} from '@stripe/react-stripe-js'
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { createStripePaymentIntentAPI } from '../../api/StripePayment/StripePaymentAPI';
import StatusMessage from '../Alert/StatusMessage';

const CheckoutForm = () => {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const plan = params.plan;
  const amount = searchParams.get('amount');
  const mutation = useMutation({mutationFn: createStripePaymentIntentAPI})

  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async(e) => {
    e.preventDefault();
    if(elements === null) return;

    const {error: submitError} = await elements.submit();
    if(submitError) return;

    try {
      const data = { amount, plan};
      mutation.mutate(data);

      if(mutation?.isSuccess) {
        const {error} = await stripe.confirmPayment({
          elements,
          clientSecret: mutation?.data?.clientSecret,
          confirmParams: { return_url: 'http://localhost:3000/success'}
        })
        if(error) {
          setErrorMessage(error.message)
        }
      }

    } catch (error) {
      setErrorMessage(error.message)
    }
  }

  return <div className='bg-gray-500 h-screen mt-4 flex justify-content items-center'>
    <form onSubmit={handleSubmit} className="w-96 mx-auto my-4 bg-white rounded-lg shadow-md">
      <div className="mb-4">
        <PaymentElement />
      </div>
      {mutation?.isPending && <StatusMessage type={'loading'} message={'Processing please wait...'} />}
      {mutation?.isSuccess && <StatusMessage type={'success'} message={'Payment is successful'} />}
      {mutation?.isError && <StatusMessage type={'error'} message={mutation?.error?.message} />}
      <button type="submit" className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        Pay
      </button>
      {errorMessage && (
        <div className='text-red-500 mt-4'>
          {errorMessage}
        </div>
      )}
    </form>
  </div>;
};

export default CheckoutForm;