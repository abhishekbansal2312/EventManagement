import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const CreateTask = ({ eventId, onClose }) => {
  const [formData, setFormData] = useState({
    deadline: '',
    status: '',
    OnlinePoster: { assignedTo: [] },
    OfflinePoster: { assignedTo: [] },
    CaptionToBeShared: { assignedTo: [] },
    WhatsAppGroupHandling: { assignedTo: [] },
    Announcements: { assignedTo: [] },
    EventReport: { assignedTo: [] },
    StageHandling: { assignedTo: [] },
    ApplicationToBeSigned: { assignedTo: [] },
    PhotographyDuringEvent: { assignedTo: [] },
    Anchoring: { assignedTo: [] },
    BudgetManagement: { assignedTo: [] },
    Decoration: { assignedTo: [] },
    TechnicalSupport: { assignedTo: [] },
    Coordinators: { assignedTo: [] },
    CoCoordinators: { assignedTo: [] },
  });

  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch("http://localhost:4600/api/members", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error('Failed to fetch members');
        }

        const data = await response.json();
        console.log('Fetched Members:', data); // Log fetched members
        setMembers(data);
      } catch (error) {
        toast.error('Error fetching members: ' + error.message);
      }
    };

    fetchMembers();
  }, []);

  const handleChange = (e, taskType) => {
    const { value, checked } = e.target;

    setFormData((prevState) => {
      const updatedTask = { ...prevState[taskType] };

      if (checked) {
        if (!updatedTask.assignedTo.includes(value)) {
          updatedTask.assignedTo.push(value);
        }
      } else {
        updatedTask.assignedTo = updatedTask.assignedTo.filter((id) => id !== value);
      }

      return { ...prevState, [taskType]: updatedTask };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!eventId) {
      toast.error('Event ID is required. Please ensure it is provided.');
      return;
    }
  
    // Validate assigned members
    const invalidAssignments = Object.entries(formData).some(([key, task]) => 
      key !== 'deadline' && key !== 'status' && task.assignedTo.length === 0
    );
  
    if (invalidAssignments) {
      toast.error('Please assign at least one member to each task type.');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:4600/api/tasks/${eventId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Network response was not ok');
      }
  
      const data = await response.json();
      toast.success('Task created successfully!');
      
      // Call onClose only after a successful task creation
      onClose();
    } catch (error) {
      toast.error('Error creating task: ' + error.message);
    }
  };

  // Sort members by date joined (newest first)
  const sortedMembers = members.sort((a, b) => new Date(b.dateJoined) - new Date(a.dateJoined));

  // Filter members based on search query
  const filteredMembers = sortedMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Deadline:</label>
        <input
          type="date"
          name="deadline"
          value={formData.deadline}
          onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
          required
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Status:</label>
        <select
          name="status"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
        >
          <option value="">Select Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Search Members:</label>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name"
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
        />
      </div>

      {Object.keys(formData).map((taskType) => {
        if (taskType === 'deadline' || taskType === 'status') return null; // Skip the deadline and status fields
        return (
          <div key={taskType}>
            <label className="block text-sm font-medium text-gray-700">{taskType}:</label>
            <ul className="mt-2 border border-gray-300 rounded-md">
              {filteredMembers.map((member) => {
                if (!member._id) {
                  console.warn('Member does not have an ID:', member);
                  return null;
                }
                return (
                  <li key={`${member._id}-${taskType}`} className="flex items-center p-1 hover:bg-gray-200 cursor-pointer">
                    <input
                      type="checkbox"
                      id={`member-${member._id}-${taskType}`}
                      value={member._id}
                      checked={formData[taskType]?.assignedTo?.includes(member._id) || false}
                      onChange={(e) => handleChange(e, taskType)}
                      className="mr-2"
                    />
                    <label htmlFor={`member-${member._id}-${taskType}`} className="cursor-pointer">
                      {member.name} (ID: {member._id})
                    </label>
                  </li>
                );
              })}
            </ul>
            <div className="mt-2 text-sm text-gray-500">
              {formData[taskType].assignedTo.length > 0
                ? `Assigned Members: ${formData[taskType].assignedTo.join(', ')}`
                : 'No members assigned'}
            </div>
          </div>
        );
      })}

      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">
        Create Task
      </button>
    </form>
  );
};

export default CreateTask;
