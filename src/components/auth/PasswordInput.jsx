import { useState } from "react";

export const PasswordInput = ({ id, label, register, error }) => {
    const [show, setShow] = useState(false);

    return (
        <div className="space-y-2">
            <label htmlFor={id} className="block text-sm font-medium">
                {label}
            </label>

            <div className="relative">
                <input
                    id={id}
                    type={show ? "text" : "password"}
                    {...register}
                    className={`w-full px-4 py-2 pr-10 border rounded-lg 
                        focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                        outline-none transition 
                        ${error ? "border-red-500" : "border-gray-300"}
                    `}
                    placeholder="••••••••"
                />

                <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                    {show ? "👁️" : "👁️‍🗨️"}
                </button>
            </div>

            {error && <p className="text-sm text-red-500">{error.message}</p>}
        </div>
    );
};
