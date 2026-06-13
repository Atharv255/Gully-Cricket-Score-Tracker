import React from "react";
import { Link } from "react-router-dom";
import { MdArrowBack, MdSportsCricket } from "react-icons/md";
import CreateMatchForm from "../../components/admin/CreateMatchForm";
import Card from "../../components/common/Card";

const CreateMatchPage = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/admin/dashboard"
          className="text-gray-400 hover:text-white transition-colors p-1"
        >
          <MdArrowBack size={22} />
        </Link>
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <MdSportsCricket className="text-cricket-green" />
            Create New Match
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Fill in the details to create a new cricket match
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CreateMatchForm />
      </Card>
    </div>
  );
};

export default CreateMatchPage;