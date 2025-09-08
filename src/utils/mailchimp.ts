// MailChimp client-side integration using iframe form submission

export const subscribeToMailChimp = async (
  email: string,
  subscribeToBulletin: boolean,
  quizData?: {
    score: number;
    tier: string;
    accuracy: number;
  }
): Promise<boolean> => {
  console.log('Subscription request:', { email, subscribeToBulletin, quizData });

  // STRICT CONSENT LOGIC: Only proceed if user explicitly consented
  if (!subscribeToBulletin) {
    console.log('User did NOT consent to newsletter - skipping MailChimp entirely');
    return true; // Return success but skip MailChimp
  }

  console.log('User CONSENTED to newsletter - proceeding with MailChimp subscription');

  // MailChimp iframe submission (no CORS issues)
  const MAILCHIMP_URL = 'https://ammo.us2.list-manage.com/subscribe/post';
  const USER_ID = '92e5fabeec50377fd6b0c666d';
  const LIST_ID = '835c3fc179';
  const FORM_ID = '002ec0e1f0';

  try {
    // Create hidden form and iframe
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.name = 'mailchimp_frame_' + Date.now();
    
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = MAILCHIMP_URL;
    form.target = iframe.name;
    form.style.display = 'none';

    // Add form fields matching MailChimp's expected format
    const fields = {
      u: USER_ID,
      id: LIST_ID,
      f_id: FORM_ID,
      EMAIL: email,
      // Use the hidden tags field from your form (tag ID 248403)
      'tags': '248403',
      // Add quiz data as merge fields (MailChimp custom fields)
      'MERGE1': quizData?.score?.toString() || '', // Quiz Score
      'MERGE2': quizData?.tier || '', // Quiz Tier
      'MERGE3': quizData?.accuracy?.toString() || '', // Quiz Accuracy
      'MERGE4': new Date().toISOString().split('T')[0], // Quiz Date
      [`b_${USER_ID}_${LIST_ID}`]: '', // Bot field (must be empty)
    };

    Object.entries(fields).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    // Add to DOM and submit
    document.body.appendChild(iframe);
    document.body.appendChild(form);

    return new Promise((resolve) => {
      iframe.onload = () => {
        console.log('✅ MailChimp form submitted successfully');
        // Clean up
        document.body.removeChild(iframe);
        document.body.removeChild(form);
        resolve(true);
      };

      iframe.onerror = () => {
        console.error('❌ MailChimp form submission failed');
        document.body.removeChild(iframe);
        document.body.removeChild(form);
        resolve(false);
      };

      // Submit the form
      form.submit();
    });

  } catch (error) {
    console.error('MailChimp subscription error:', error);
    return false;
  }
};

// Send quiz results email (this would typically be done server-side)
export const sendQuizResultsEmail = async (
  _email: string,
  _quizData: {
    score: number;
    totalQuestions: number;
    tier: any;
    userAnswers: any[];
    accuracy: number;
  }
) => {
  // In a real implementation, this would call your backend API
  // which would then send a detailed email with results
  
  // For now, simulate the email sending
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
};