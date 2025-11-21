
export const FormInput = ({ id, label, type = "text", placeholder, register, error }) => {
    return (
        <div className="space-y-2">
            <label htmlFor={id} className="block text-sm font-medium">{label}</label>
            <input
                id={id}
                type={type}
                placeholder={placeholder}
                {...register}
                className={`w-full px-4 py-2 border rounded-lg 
                ${error ? "border-red-500" : "border-gray-300"}`}
            />
            {error && <p className="text-sm text-red-500">{error.message}</p>}
        </div>
    )
}