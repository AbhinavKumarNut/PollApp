import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function CreateScreen({username}) {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        title: "",
        options: [""],
        created_at: new Date(),
        created_by: username
    });


    const handleChanges = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleOptionChange = (e, index) => {
        const newOptions = [...formData.options];
        newOptions[index] = e.target.value;
        setFormData({ ...formData, options: newOptions });
    };

    const addOptionField = () => {
        setFormData({ ...formData, options: [...formData.options, ""] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.target.created_at = new Date();
        e.target.created_by = username;
        const filteredOptions = formData.options.filter(option => option.trim() !== "");
        if (!formData.title || filteredOptions.length === 0) {
            console.error("Title and at least one option are required.");
            return;
        }

        const pollDataToSend = {
            ...formData,
            options: filteredOptions,
            created_at: new Date(),
            created_by: username
        };
        try{
            const respone = await fetch('http://localhost:8080/newpoll', {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify(pollDataToSend)
            })

            if(respone.ok){
                const responseData = await respone.json();
                console.log('Poll created successfully:', responseData);
                navigate('/home');
            }
            else{
                const errorData = await respone.json();
                console.error('Poll creation failed:', errorData.message);
            }
        }
        catch(error){
            console.error('Error during poll creation:', error, pollDataToSend);
        }
    }
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Create a New Poll</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-gray-700 font-bold mb-2">Poll Title</label>
                        <input
                            id="title"
                            type="text"
                            name="title"
                            required
                            onChange={(e) => handleChanges(e)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Options</label>
                        <div className="space-y-4">
                            {formData.options.map((option, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    name={`option${index + 1}`}
                                    value={option}
                                    required
                                    onChange={(e) => handleOptionChange(e, index)}
                                    placeholder={`Option ${index + 1}`}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={addOptionField}
                            className="mt-4 w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                        >
                            Add Option
                        </button>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                    >
                        Create Poll
                    </button>
                </form>
            </div>
        </div>
    )
}