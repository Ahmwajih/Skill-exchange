import React, { useState } from "react";
import { useRouter } from "next/navigation";

function ModalConversation({providerName, providerEmail, closeModal} ) {
  const [message, setMessage] = useState("");
  const [timeFrame, setTimeFrame] = useState("1 day");
  const [showDealFields, setShowDealFields] = useState(false);
  const [numberOfSessions, setNumberOfSessions] = useState(1);
  const [skillsOffered, setSkillsOffered] = useState("");
  const [showModal, setShowModal] = useState(false);




  const handleSend = async () => {
    const dealDetails = showDealFields
      ? `<br><strong>Proposed Deal:</strong><br>Time Frame: ${timeFrame}<br>Skills Offered: ${skillsOffered}<br>Number of Sessions: ${numberOfSessions}`
      : "";

    const emailContent = `
      <p>${message}</p>
      ${dealDetails}
    `;

    try {
      const response = await fetch('/api/sendmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: providerEmail,
          subject: `From Community Skill Exchane New Message from ${providerName}`, // the message is from the seeker not the provider 
          html: emailContent,
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert('Message sent successfully!');
        resetFields();
        closeModal();
      } else {
        alert('Failed to send message.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('An error occurred while sending the message.');
    }
  };

  const handleCancel = () => {
    
    setShowModal(false);
    resetFields();
    console.log("Cancel");

  };
 

  const resetFields = () => {
    setMessage("");
    setTimeFrame("1 day");
    setShowDealFields(false);
    setSkillsOffered("");
    setNumberOfSessions(1);
  };
  return (
    <div>
      {/* Modal */}
        <dialog
          id="conversation-modal"
          open
          onClose = {handleCancel}
          className="modal fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center"
        >
          <div className="modal-box w-11/12 max-w-5xl bg-white p-6 rounded-md shadow-lg">
            <h3 className="font-bold text-brown text-xl mb-4">
              Start a Conversation with {providerName}
            </h3>
            <p className="text-gray mb-6">
              Please introduce yourself with a brief message and mention what
              you are looking for and what you can offer.
            </p>

            {/* Message Input */}
            <div className="mb-4">
              <label
                htmlFor="message"
                className="block text-sm font-medium text-brown mb-2"
              >
                Your Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2 border bg-white rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g Hi, I'm a frontend developer looking to improve my skills. I can offer help with React and JavaScript. I'm interested in learning more about Node.js and backend development."
                rows={4}
              />
            </div>

            {/* Propose a Deal Dropdown */}
            <div className="mb-4">
              <button
                onClick={() => setShowDealFields(!showDealFields)}
                className="w-full bg-orange text-white py-2 px-4 border rounded-md hover:bg-orange"
              >
                {showDealFields ? "Remove Deal" : "Propose a Deal"}
              </button>
            </div>

            {/* Deal Fields */}
            {showDealFields && (
              <div className="deal-fields">
                {/* Time Frame Dropdown */}
                <div className="mb-4">
                  <label
                    htmlFor="timeFrame"
                    className="block text-sm font-medium text-brown mb-2"
                  >
                    Time Frame
                  </label>
                  <select
                    id="timeFrame"
                    value={timeFrame}
                    onChange={(e) => setTimeFrame(e.target.value)}
                    className="w-full px-4 bg-white py-2 border text-gray rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="1 day">1 day</option>
                    <option value="1 week">1 week</option>
                    <option value="2 weeks">2 weeks</option>
                    <option value="1 month">1 month</option>
                    <option value="2 months">2 months</option>
                  </select>
                </div>

                {/* Skills Offered */}
                <div className="mb-4">
                  <label
                    htmlFor="skillsOffered"
                    className="block text-sm font-medium text-brown mb-2"
                  >
                    Skills Offered
                  </label>
                  <textarea
                    id="skillsOffered"
                    value={skillsOffered}
                    onChange={(e) => setSkillsOffered(e.target.value)}
                    className="w-full bg-white px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="List the skills you can offer (e.g., Web Development, Graphic Design)..."
                    rows={3}
                  />
                </div>

                {/* Number of Sessions Desired */}
                <div className="mb-4">
                  <label
                    htmlFor="numberOfSessions"
                    className="block text-sm font-medium text-brown mb-2"
                  >
                    Number of Sessions Desired
                  </label>
                  <input
                    type="number"
                    id="numberOfSessions"
                    value={numberOfSessions}
                    onChange={(e) =>
                      setNumberOfSessions(Number(e.target.value))
                    }
                    className="w-full bg-white px-4 py-2 text-gray border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                    placeholder="Enter the number of sessions"
                  />
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="modal-action flex justify-end gap-4">
              <button
                onClick={closeModal}
                className="btn bg-gray text-white py-2 px-4 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                className="btn bg-blue text-white py-2 px-6 rounded-md hover:bg-blue"
              >
                Send
              </button>
            </div>
          </div>
        </dialog>
    </div>
  );
}

export default ModalConversation;
