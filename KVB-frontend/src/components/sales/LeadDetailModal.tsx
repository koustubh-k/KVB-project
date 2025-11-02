import React, { useState, useEffect } from "react";
import { Lead, LeadNote } from "@/types";
import { salesAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import {
  X,
  Send,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  MessageSquare,
  Bot,
} from "lucide-react";

interface LeadDetailModalProps {
  lead: Lead | null;
  onClose: () => void;
  onUpdate: () => void;
}

const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  lead,
  onClose,
  onUpdate,
}) => {
  const { user } = useAuth();
  const [newNote, setNewNote] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);

  if (!lead) return null;

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      setIsAddingNote(true);
      await salesAPI.addLeadNote(lead._id, {
        message: newNote.trim(),
        addedBy: user?._id,
      });
      setNewNote("");
      onUpdate(); // Refresh the data
    } catch (error) {
      console.error("Error adding note:", error);
    } finally {
      setIsAddingNote(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-500";
      case "contacted":
        return "bg-yellow-500";
      case "follow-up pending":
        return "bg-orange-500";
      case "converted":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-white">{lead.name}</h2>
            <div className="flex items-center space-x-4 mt-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  lead.status
                )} text-white`}
              >
                {lead.status.replace("-", " ").toUpperCase()}
              </span>
              <span className="text-gray-400 text-sm">{lead.source}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-80px)]">
          {/* Lead Info Sidebar */}
          <div className="w-80 bg-gray-750 p-6 border-r border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">
              Lead Information
            </h3>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-white font-medium">{lead.name}</p>
                  <p className="text-gray-400 text-sm">Full Name</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-white font-medium">{lead.email}</p>
                  <p className="text-gray-400 text-sm">Email Address</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-white font-medium">{lead.phone}</p>
                  <p className="text-gray-400 text-sm">Phone Number</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-white font-medium">{lead.region}</p>
                  <p className="text-gray-400 text-sm">Region</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-white font-medium">
                    {formatDate(lead.createdAt)}
                  </p>
                  <p className="text-gray-400 text-sm">Created</p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes/Chat Section */}
          <div className="flex-1 flex flex-col">
            {/* Notes Header */}
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Interaction History
                </h3>
                <span className="text-gray-400 text-sm">
                  {lead.notes.length} notes
                </span>
              </div>
            </div>

            {/* Notes/Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {lead.notes.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No notes yet</p>
                  <p className="text-gray-500 text-sm">
                    Add the first note to start tracking interactions
                  </p>
                </div>
              ) : (
                lead.notes
                  .sort(
                    (a, b) =>
                      new Date(a.addedAt).getTime() -
                      new Date(b.addedAt).getTime()
                  )
                  .map((note, index) => (
                    <div
                      key={note._id || index}
                      className={`flex ${
                        note.addedBy?._id === user?._id
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          note.addedBy?._id === user?._id
                            ? "bg-blue-600 text-white"
                            : note.addedBy
                              ? "bg-gray-700 text-white"
                              : "bg-green-600 text-white"
                        }`}
                      >
                        {/* Note Header */}
                        <div className="flex items-center space-x-2 mb-1">
                          {note.addedBy ? (
                            <User className="w-3 h-3" />
                          ) : (
                            <Bot className="w-3 h-3" />
                          )}
                          <span className="text-xs opacity-75">
                            {note.addedBy ? note.addedBy.fullName : "System"}
                          </span>
                          <span className="text-xs opacity-75">
                            {formatDate(note.addedAt)}
                          </span>
                        </div>

                        {/* Note Message */}
                        <p className="text-sm">{note.message}</p>
                      </div>
                    </div>
                  ))
              )}
            </div>

            {/* Add Note Input */}
            <div className="p-6 border-t border-gray-700">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !isAddingNote) {
                      handleAddNote();
                    }
                  }}
                  placeholder="Add a note about this lead..."
                  className="flex-1 input"
                  disabled={isAddingNote}
                />
                <button
                  onClick={handleAddNote}
                  disabled={!newNote.trim() || isAddingNote}
                  className="btn-primary flex items-center px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAddingNote ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailModal;
