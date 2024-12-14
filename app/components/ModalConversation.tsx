"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectedUserById } from "@/lib/features/dashboard/userSlice";
import { createDeal} from "@/lib/features/deal/dealSlice"; 
import { RootState, AppDispatch } from "@/lib/store";
import { Calendar, Badge, List } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import { toast } from "react-toastify";
import socket from "@/Utils/socket";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

function ModalConversation({ providerId, closeModal }) {
  const [message, setMessage] = useState("");
  const [timeFrame, setTimeFrame] = useState("1 day");
  const [showDealFields, setShowDealFields] = useState(false);
  const [numberOfSessions, setNumberOfSessions] = useState(1);
  const [skillsOffered, setSkillsOffered] = useState("");
  const [provider, setProvider] = useState(null);
  const [seeker, setSeeker] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedAvailabilities, setSelectedAvailabilities] = useState([]);

  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.currentUser);

  // Fetch provider data
  useEffect(() => {
    if (providerId) {
      dispatch(selectedUserById(providerId)).then((response) => {
        if (response.payload) {
          setProvider(response.payload.data);
        } else {
          console.error("Failed to fetch provider:", response.error.message);
        }
      });
    }
  }, [dispatch, providerId]);

  // Fetch seeker data
  useEffect(() => {
    if (user.id) {
      dispatch(selectedUserById(user.id)).then((response) => {
        if (response.payload) {
          setSeeker(response.payload.data);
        } else {
          console.error("Failed to fetch seeker:", response.error.message);
        }
      });
    }
  }, [dispatch, user.id]);

  // Handle sending a deal
  const handleSend = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message.");
      return;
    }

    if (showDealFields && !skillsOffered.trim()) {
      toast.error("Please specify the skills offered.");
      return;
    }

    // Prepare deal data
    const dealData = {
      providerId: providerId,
      seekerId: user.id,
      timeFrame,
      skillOffered: skillsOffered,
      numberOfSessions,
      selectedAvailabilities,
      status: "pending",
    };

    try {
      // Dispatch the createDeal action
      await dispatch(createDeal(dealData));
      
      // Success feedback
      toast.success("Deal sent and created successfully!");

      // Prepare message content for socket
      const dealDetails = showDealFields
        ? `<br><strong>Proposed Deal:</strong><br>Time Frame: ${timeFrame}<br>Skills Offered: ${skillsOffered}<br>Number of Sessions: ${numberOfSessions}`
        : "";
      
      const selectedAvailability = selectedAvailabilities.length
        ? `<br><strong>Selected Availability:</strong><br>${selectedAvailabilities.join("<br>")}`
        : "";
      
      const acceptDealLink = `${BASE_URL}/api/accept-deal/${providerId}?providerEmail=${provider.email}&providerName=${provider.name}&seekerEmail=${user.email}&seekerName=${user.name}&seekerId=${user.id}`;
      
      const messageContent = `${message}${dealDetails}${selectedAvailability}<br><a href="${acceptDealLink}">Accept Deal</a>`;
        
      // Emit message via socket with additional identifiers for starting a conversation
      socket.emit("send_message", { text: messageContent, room: provider._id, senderId: user.id });
  
  
      // Reset message field
      setMessage("");

      // Prepare and send email content
      const emailContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; padding: 20px;">
          <div style="max-width: 600px; margin: auto; background-color: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            <div style="text-align: center; padding: 20px; border-bottom: 1px solid #ddd;">
              <a href="${BASE_URL}" style="text-decoration: none; color: #333;">
                <img src="" alt="Skill Logo" style="max-width: 150px;">
              </a>
            </div>
            <div style="padding: 20px;">
              <h2 style="color: #333;">${seeker.name} has sent you a proposal:</h2>
              <div style="text-align: center; margin-bottom: 20px;">
                <img src="${seeker.photo}" alt="${seeker.name}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover;">
                <p style="margin-top: 10px;"><strong>${seeker.name}</strong><br>${seeker.country}</p>
              </div>
              <p><strong>New Proposal Received</strong></p>
              <p>${message}</p>
              ${dealDetails}
              ${selectedAvailability}
              <p style="text-align: center;">
                <a href="${acceptDealLink}" style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Accept/Decline</a>
              </p>
            </div>
            <div style="text-align: center; padding: 20px; background-color: #f9f9f9; border-top: 1px solid #ddd;">
              <p style="margin-bottom: 5px;">Please add us to your address book to ensure you don’t miss any messages.</p>
              <p style="margin-bottom: 0;">Best regards,<br>The Community Skill Exchange Team</p>
            </div>
          </div>
        </div>
      `;

      // Send email notification
      const response = await fetch("/api/sendmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: provider.email,
          subject: `Community Skill Exchange New Message from ${user.name}`,
          html: emailContent,
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success("Email sent successfully!");
        resetFields();
        closeModal();
      } else {
        toast.error("Failed to send email.");
      }
    } catch (error) {
      console.error("Error creating deal or sending message:", error);
      toast.error("An error occurred while sending the deal or message.");
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
    setSelectedDate(null);
    setSelectedTime("");
    closeModal();
  };

  const getTodoList = (date) => {
    if (!date || !provider || !provider.availability) {
      return [];
    }
    const dateString = date.toISOString().split("T")[0];
    const availability = provider.availability.find(
      (avail) => avail.date === dateString
    );
    return availability
      ? availability.times.map((time) => ({ time, title: "Available" }))
      : [];
  };

  const renderCell = (date) => {
    const list = getTodoList(date);
    if (list.length) {
      return <Badge className="calendar-todo-item-badge" />;
    }
    return null;
  };

  const TodoList = ({ date }) => {
    const list = getTodoList(date);
    if (!list.length) {
      return null;
    }
    const toggleAvailability = (date, time) => {
      const dateString = date.toISOString().split("T")[0];
      const availabilityString = `${dateString} ${time}`;
      setSelectedAvailabilities((prev) =>
        prev.includes(availabilityString)
          ? prev.filter((a) => a !== availabilityString)
          : [...prev, availabilityString]
      );
    };
    return (
      <List style={{ flex: 1 }} bordered>
        {list.map((item, index) => (
          <List.Item
            key={index}
            onClick={() => toggleAvailability(date, item.time)}
            style={{
              backgroundColor: selectedAvailabilities.includes(
                `${date.toISOString().split("T")[0]} ${item.time}`
              )
                ? "#e0f7fa"
                : "transparent",
            }}
          >
            <div>{item.time}</div>
            <div>{item.title}</div>
          </List.Item>
        ))}
      </List>
    );
  };

  const disabledDate = (date) => {
    const now = new Date();
    const threeMonthsLater = new Date();
    threeMonthsLater.setMonth(now.getMonth() + 3);
    return date < now || date > threeMonthsLater;
  };

  return (
    <div>
      {/* Modal */}
      <dialog
        id="conversation-modal"
        open
        onClose={handleCancel}
        className="modal fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center"
      >
        <div className="modal-box w-11/12 max-w-5xl bg-white p-6 rounded-md shadow-lg">
          <h3 className="font-bold text-brown text-xl mb-4">
            Start a Conversation with {provider?.name}
          </h3>
          <p className="text-gray mb-6">
            Please introduce yourself with a brief message and mention what you
            are looking for and what you can offer.
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
                  onChange={(e) => setNumberOfSessions(Number(e.target.value))}
                  className="w-full bg-white px-4 py-2 text-gray border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                  placeholder="Enter the number of sessions"
                />
              </div>
            </div>
          )}

          {/* Calendar and Todo List */}
          <div className="flex">
            <Calendar
              compact
              renderCell={renderCell}
              onSelect={setSelectedDate}
              style={{ width: 320 }}
              disabledDate={disabledDate}
            />
            <div className="flex-1 ml-4">
              <TodoList date={selectedDate} />
            </div>
          </div>

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
