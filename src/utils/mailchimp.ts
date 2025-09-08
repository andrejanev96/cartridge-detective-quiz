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
    // MailChimp environment variables not configured - skip subscription
    return true;
  }

  // Only subscribe users who checked the newsletter checkbox
  if (!subscribeToBulletin) {
    return true; // Skip MailChimp entirely if user doesn't want newsletter
  }

  try {
    const url = `https://${SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`;
    
    const subscriberData: MailChimpSubscriber = {
      email_address: email,
      status: 'subscribed', // Only subscribed users reach this point
      tags: ['Cartridge Quiz Contact'],
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
      return true;
    } else {
      await response.json(); // Read response to avoid memory leaks
      return false;
    }
  } catch {
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