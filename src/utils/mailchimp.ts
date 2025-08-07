// MailChimp API integration
// You'll need to set these environment variables:
// VITE_MAILCHIMP_API_KEY=your_api_key
// VITE_MAILCHIMP_SERVER_PREFIX=your_server_prefix (e.g., us12)
// VITE_MAILCHIMP_LIST_ID=your_list_id

interface MailChimpSubscriber {
  email_address: string;
  status: 'subscribed' | 'unsubscribed';
  tags?: string[];
  merge_fields?: {
    FNAME?: string;
    LNAME?: string;
    QUIZ_SCORE?: number;
    QUIZ_TIER?: string;
    QUIZ_DATE?: string;
  };
}

export const subscribeToMailChimp = async (
  email: string,
  subscribeToBulletin: boolean,
  quizData?: {
    score: number;
    tier: string;
    accuracy: number;
  }
): Promise<boolean> => {
  const API_KEY = import.meta.env.VITE_MAILCHIMP_API_KEY;
  const SERVER_PREFIX = import.meta.env.VITE_MAILCHIMP_SERVER_PREFIX;
  const LIST_ID = import.meta.env.VITE_MAILCHIMP_LIST_ID;

  if (!API_KEY || !SERVER_PREFIX || !LIST_ID) {
    console.warn('MailChimp environment variables not configured');
    // For development, just log the data
    console.log('Would subscribe:', {
      email,
      subscribeToBulletin,
      quizData,
    });
    return true;
  }

  try {
    const url = `https://${SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`;
    
    const subscriberData: MailChimpSubscriber = {
      email_address: email,
      status: subscribeToBulletin ? 'subscribed' : 'unsubscribed',
      tags: ['cartridge-quiz'],
      merge_fields: {
        QUIZ_SCORE: quizData?.score,
        QUIZ_TIER: quizData?.tier,
        QUIZ_DATE: new Date().toISOString().split('T')[0],
      },
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`anystring:${API_KEY}`)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subscriberData),
    });

    if (response.ok) {
      console.log('Successfully subscribed to MailChimp');
      return true;
    } else {
      const error = await response.json();
      console.error('MailChimp subscription failed:', error);
      return false;
    }
  } catch (error) {
    console.error('MailChimp API error:', error);
    return false;
  }
};

// Send quiz results email (this would typically be done server-side)
export const sendQuizResultsEmail = async (
  email: string,
  quizData: {
    score: number;
    totalQuestions: number;
    tier: any;
    userAnswers: any[];
    accuracy: number;
  }
) => {
  // In a real implementation, this would call your backend API
  // which would then send a detailed email with results
  
  console.log('Sending quiz results email to:', email, quizData);
  
  // For now, simulate the email sending
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Quiz results email sent successfully');
      resolve(true);
    }, 1000);
  });
};