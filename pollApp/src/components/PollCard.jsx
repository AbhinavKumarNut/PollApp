import { format } from 'date-fns';


export function PollCard({ poll, onClick }) {

  const { Title, CreatedAt, CreatedBy, Options } = poll;
  const formattedDate = format(new Date(CreatedAt), 'MMMM d, yyyy h:mm a');

  return (
    <div
      onClick={onClick}
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer border border-gray-200"
    >
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{Title}</h2>
      <p className="text-sm text-gray-500 mb-1">
        Created by: <span className="font-medium text-gray-700">{CreatedBy}</span>
      </p>

      <p className="text-sm text-gray-500 mb-4">
        Created on: <span className="font-medium text-gray-700">{formattedDate}</span>
      </p>

      <div className="flex flex-wrap gap-2">
        {Options.map((option, index) => (
          <span
            key={index}
            className="text-xs font-medium bg-gray-200 text-gray-700 py-1 px-3 rounded-full"
          >
            {option}
          </span>
        ))}
      </div>
    </div>
  );
}

export function MyPollCard({ poll, onClick, onDelete }) {

  const { Title, CreatedAt, CreatedBy, Options } = poll;
  const formattedDate = format(new Date(CreatedAt), 'MMMM d, yyyy h:mm a');

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{Title}</h2>
      <p className="text-sm text-gray-500 mb-1">
        Created by: <span className="font-medium text-gray-700">{CreatedBy}</span>
      </p>

      <p className="text-sm text-gray-500 mb-4">
        Created on: <span className="font-medium text-gray-700">{formattedDate}</span>
      </p>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={onClick}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300"
        >
          Vote
        </button>
        <button
          onClick={onDelete}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition duration-300"
        >
          Delete
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        {Options.map((option, index) => (
          <span
            key={index}
            className="text-xs font-medium bg-gray-200 text-gray-700 py-1 px-3 rounded-full"
          >
            {option}
          </span>
        ))}
      </div>
    </div>
  );
}

