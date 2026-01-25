import IconButton from './UI/IconButton';

interface TopBarProps {
    profileImage?: string;
    onNotificationClick?: () => void;
    onSettingsClick?: () => void;
    onProfileClick?: () => void;
}

export default function TopBar({
    profileImage,
    onNotificationClick,
    onSettingsClick,
    onProfileClick,
}: TopBarProps) {
    return (
        <header className="hidden items-center justify-end border-b border-gray-200 bg-gray-50 px-8 py-4 md:flex">
            <div className="flex items-center gap-4">
                <div className="flex gap-2">
                    <IconButton
                        icon="notifications"
                        onClick={onNotificationClick}
                    />
                    <IconButton icon="settings" onClick={onSettingsClick} />
                </div>
                <button
                    onClick={onProfileClick}
                    className="size-10 rounded-full bg-cover bg-center bg-no-repeat ring-2 ring-gray-200"
                    style={{
                        backgroundImage: profileImage
                            ? `url("${profileImage}")`
                            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }}
                    aria-label="User profile"
                />
            </div>
        </header>
    );
}
