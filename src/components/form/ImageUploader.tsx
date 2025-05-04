// components/Form/ImageUploader.tsx
import Image from 'next/image'

type Props = {
    preview: string | null
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function ImageUploader({ preview, onChange }: Props) {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Foto (máx. 3 MB)</label>
            <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={onChange}
                className="text-gray-600"
            />
            {preview && (
                <Image
                    src={preview}
                    alt="Vista previa"
                    width={150}
                    height={150}
                    className="mt-4 rounded-lg object-cover border"
                />
            )}
        </div>
    )
}
