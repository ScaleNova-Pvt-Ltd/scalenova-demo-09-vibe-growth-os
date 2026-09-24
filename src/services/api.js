/**
 * ScaleNova Systems — Client API Dispatcher
 * Demo: Vibe Growth OS (DEMO-09)
 */

window.ScaleNovaAPI = (function () {
  'use strict';

  const config = window.DEMO_CONFIG || {
    demoId: 'DEMO-09',
    industry: 'AI Marketing & SaaS Platform',
    clientName: 'Vibe Growth OS',
    appsScriptUrl: 'https://script.google.com/macros/s/AKfycby-kC_gnWLAMrKc40yu0TOga5yZDreR50X-2AWw2rHrzCFi3oZp2W9Xqq3KXNoTh6bj/exec'
  };

  async function submitLead(formData, options = {}) {
    if (!formData.name || !formData.email) {
      throw new Error('Name and email are required.');
    }

    const payload = {
      demo_id: config.demoId,
      lead_type: (formData.lead_type || 'TRIAL').toUpperCase(),
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: (formData.phone || '').trim(),
      company: formData.company || formData.workspace_name || 'Autonomous Growth Workspace',
      service: formData.plan_selected || formData.service || 'Growth OS Pro Tier ($79/mo)',
      requirement: `Target Channels: ${formData.channels || 'LinkedIn, X, Threads'} | Team Seats: ${formData.team_seats || '5 Seats'}`,
      project_type: 'SaaS Subscription Onboarding',
      budget: formData.budget || '$79/month',
      preferred_date: new Date().toISOString().slice(0, 10),
      preferred_time: '',
      message: (formData.message || formData.notes || '').trim(),
      source: 'Vibe Growth OS Website',
      source_page: formData.source_page || window.location.pathname || 'Home'
    };

    const optimisticId = 'SN-D09-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + Math.floor(1000 + Math.random() * 9000);

    const networkPromise = fetch(config.appsScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    }).then(async r => {
      try { return await r.json(); } catch (e) { return { success: true, submission_id: optimisticId }; }
    }).catch(() => ({ success: true, submission_id: optimisticId }));

    const quickTimeout = new Promise(resolve => setTimeout(() => {
      resolve({ success: true, submission_id: optimisticId, optimistic: true });
    }, 900));

    try {
      const result = await Promise.race([networkPromise, quickTimeout]);
      return {
        success: true,
        submission_id: (result && (result.submission_id || result.submissionId)) || optimisticId,
        demo_id: 'DEMO-09',
        message: 'Growth workspace provisioned successfully'
      };
    } catch (err) {
      return { success: true, submission_id: optimisticId, demo_id: 'DEMO-09' };
    }
  }

  return { submitLead };
})();
