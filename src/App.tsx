import React, { useState, useEffect } from 'react';
import { Send, Mail, Loader2, Settings } from 'lucide-react';
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
      const response = await fetch(`https://jesse-email-sender.vercel.app:${settings.port}/api/send-email`, {
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