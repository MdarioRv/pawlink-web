// components/Form/InputField.tsx
type Props = {
    label: string
    type?: string
    value: string | number
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    required?: boolean
    placeholder?: string
    min?: number
    max?: number
}

export default function InputField({
    label, type = 'text', value, onChange, required = false, placeholder = '', min, max
}: Props) {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                min={min}
                max={max}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            />
        </div>
    )
}
