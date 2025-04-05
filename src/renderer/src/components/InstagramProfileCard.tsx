const InstagramProfileCard = ({ data }) => {
    const { handle, fullName, posts, followers, following, postLinks } = data;

    if (!data) return <>Fetching ...</>

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 rounded-2xl shadow-lg border border-gray-200 bg-white text-black">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-pink-500 to-yellow-400 flex items-center justify-center text-white font-bold text-xl uppercase">
                    {fullName?.[0]}
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">{fullName}</h2>
                    <p className="text-sm text-gray-500">@{handle}</p>
                </div>
            </div>

            <div className="grid grid-cols-3 text-center gap-4 mb-6">
                <div>
                    <p className="text-lg font-semibold text-gray-700">{posts}</p>
                    <p className="text-xs text-gray-500">Posts</p>
                </div>
                <div>
                    <p className="text-lg font-semibold text-gray-700">{followers}</p>
                    <p className="text-xs text-gray-500">Followers</p>
                </div>
                <div>
                    <p className="text-lg font-semibold text-gray-700">{following}</p>
                    <p className="text-xs text-gray-500">Following</p>
                </div>
            </div>

            <div className="max-h-60 overflow-y-auto border-t border-gray-100 pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Links:</h3>
                <ul className="space-y-2">
                    {postLinks?.map((link, idx) => (
                        <li key={idx}>
                            <a
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-500 hover:underline break-all"
                            >
                                {link}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export { InstagramProfileCard }