// MailChimp client-side integration using iframe form submission

export const subscribeToMailChimp = async (
  email: string,
  subscribeToBulletin: boolean
): Promise<boolean> => {
  // STRICT CONSENT LOGIC: Only proceed if user explicitly consented
  if (!subscribeToBulletin) {
    return true; // Return success but skip MailChimp
  }

  try {
    // Just replicate exactly what your embedded form does - nothing more, nothing less
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.name = 'hidden_iframe_' + Date.now();
    
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://ammo.us2.list-manage.com/subscribe/post?u=92e5fabeec50377fd6b0c666d&id=835c3fc179&f_id=002ec0e1f0';
    form.target = iframe.name;
    form.style.display = 'none';

    // Only the essential fields from your embedded form
    const emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.name = 'EMAIL';
    emailInput.value = email;
    form.appendChild(emailInput);

    // Tags field (exactly as in your embedded form)
    const tagsInput = document.createElement('input');
    tagsInput.type = 'hidden';
    tagsInput.name = 'tags';
    tagsInput.value = '248403';
    form.appendChild(tagsInput);

    // Bot protection field (exactly as in your embedded form)
    const botInput = document.createElement('input');
    botInput.type = 'text';
    botInput.name = 'b_92e5fabeec50377fd6b0c666d_835c3fc179';
    botInput.value = '';
    botInput.style.position = 'absolute';
    botInput.style.left = '-5000px';
    botInput.setAttribute('tabindex', '-1');
    form.appendChild(botInput);

    // Submit button (exactly as in your embedded form)
    const submitInput = document.createElement('input');
    submitInput.type = 'submit';
    submitInput.name = 'subscribe';
    submitInput.value = 'Subscribe';
    form.appendChild(submitInput);

    // Add to DOM
    document.body.appendChild(iframe);
    document.body.appendChild(form);

    // Submit and clean up
    form.submit();
    
    setTimeout(() => {
      document.body.removeChild(iframe);
      document.body.removeChild(form);
    }, 3000);

    return true;

  } catch (error) {
    return false;
  }
};
// Email sending removed — results are unlocked on-screen after email entry.
