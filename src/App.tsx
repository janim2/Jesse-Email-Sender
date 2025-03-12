import React, { useState, useEffect } from 'react';
import { Send, Mail, Loader2, Settings, Clipboard } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

function App() {
  const [emails, setEmails] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    emailUser: '',
    emailPassword: '',
    port: '3000'
  });
  const [showTemplates, setShowTemplates] = useState(false);
  const [templates, setTemplates] = useState([
    {
      name: 'Email Confirmation',
      content: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Email Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
    <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
        <tr>
            <td align="center">
                <table width="600px" cellspacing="0" cellpadding="0" border="0" style="background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
                    <tr>
                        <td align="center" style="padding: 20px 0;">
                            <h2 style="color: #333;">Confirm Your Email</h2>
                        </td>
                    </tr>
                    <tr>
                        <td style="color: #555; font-size: 16px; text-align: center; padding: 10px 20px;">
                            Thank you for signing up! Please confirm your email address to continue using your ChatGPT account.
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding: 20px;">
                            <a href="https://example.com/verify-email" 
                               style="background-color: #007bff; color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 5px; font-size: 16px;">
                               Confirm Email
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td style="color: #777; font-size: 14px; text-align: center; padding: 10px 20px;">
                            This confirmation link will be valid for the next 3 hours. If you did not request this, you can safely ignore this email.
                        </td>
                    </tr>
                    <tr>
                        <td style="color: #777; font-size: 12px; text-align: center; padding: 20px;">
                            Need help? Visit our <a href="https://example.com/help-center" style="color: #007bff;">Help Center</a>.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`
    }
  ]);

  useEffect(() => {
    // Load saved settings from localStorage if they exist
    const savedSettings = localStorage.getItem('emailSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emails || !subject || !message) {
      toast.error('Please fill in all fields');
      return;
    }

    const emailList = emails.split(',').map(email => email.trim());
    
    if (!emailList.every(email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
      toast.error('Please enter valid email addresses');
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch(`http://localhost:${settings.port}/api/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emails,
          subject,
          message,
          isHtml: true,
          emailUser: settings.emailUser,
          emailPassword: settings.emailPassword
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Emails sent successfully!');
        setEmails('');
        setSubject('');
        setMessage('');
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error('Failed to send emails. Please try again.');
      console.error('Error:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleSaveSettings = () => {
    localStorage.setItem('emailSettings', JSON.stringify(settings));
    toast.success('Settings saved successfully!');
    setShowSettings(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center">
          <Mail className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Jess Email Sender
          </h2>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="mt-2 text-blue-600 hover:text-blue-700 flex items-center justify-center mx-auto"
          >
            <Settings className="mr-2 h-5 w-5" />
            {showSettings ? 'Hide Settings' : 'Show Settings'}
          </button>
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="mt-2 text-blue-600 hover:text-blue-700 flex items-center justify-center mx-auto"
          >
            <Clipboard className="mr-2 h-5 w-5" />
            {showTemplates ? 'Hide Templates' : 'Show Templates'}
          </button>
        </div>

        {showSettings && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Settings</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="emailUser" className="block text-sm font-medium text-gray-700">
                  Email User
                </label>
                <input
                  id="emailUser"
                  type="text"
                  value={settings.emailUser}
                  onChange={(e) => setSettings({...settings, emailUser: e.target.value})}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your email address"
                />
              </div>

              <div>
                <label htmlFor="emailPassword" className="block text-sm font-medium text-gray-700">
                  Email App Password
                </label>
                <input
                  id="emailPassword"
                  type="password"
                  value={settings.emailPassword}
                  onChange={(e) => setSettings({...settings, emailPassword: e.target.value})}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your email app password"
                />
              </div>

              <div>
                <label htmlFor="port" className="block text-sm font-medium text-gray-700">
                  Server Port
                </label>
                <input
                  id="port"
                  type="number"
                  value={settings.port}
                  onChange={(e) => setSettings({...settings, port: e.target.value})}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Server port"
                />
              </div>

              <button
                onClick={handleSaveSettings}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save Settings
              </button>
            </div>
          </div>
        )}

        {showTemplates && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Email Templates</h3>
            <div className="space-y-4">
              {templates.map((template, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">{template.name}</h4>
                  <button
                    onClick={() => setMessage(template.content)}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Use Template
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="emails" className="block text-sm font-medium text-gray-700">
                Email Addresses (comma-separated)
              </label>
              <input
                id="emails"
                type="text"
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="email1@example.com, email2@example.com"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                Subject
              </label>
              <input
                id="subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter email subject"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your message"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSending}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSending ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                Sending...
              </>
            ) : (
              <>
                <Send className="-ml-1 mr-2 h-5 w-5" />
                Send Emails
              </>
            )}
          </button>
        </form>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;