import { type FC } from "react";
import { type Snip, type Tag } from "../../lib/types";
import Dropdown from "./Dropdown";
import ExportButton from "./ExportButton";
import SettingsButton from "./SettingsButton";
import {
	useAllSnipsStore,
	useContentScriptStore,
	useSnipsStore,
} from "~stores/sniptube";

interface Props {
	tags: Set<Tag>;
	// depending on the page, either allSnips or snips will be defined and from that we can also tell the dropdown what to sort for and the tag filter what to filter for
	allSnips?: Snip[];
	snips?: Snip[];
}

const Header: FC<Props> = (props) => {
	const { tags, snips, allSnips } = props;

	const inYoutube = useContentScriptStore((state) => state.inYoutube);
	const [selectedTags, addSelectedTag, removeSelectedTag] = useSnipsStore(
		(state) => [
			state.selectedTags,
			state.addSelectedTag,
			state.removeSelectedTag,
		],
	);

	const takeUpFullHeight = allSnips?.length > 6 ?? snips?.length > 2;
	const theSnipsThatAreBeingDisplayed = allSnips ?? snips;
	const hasMoreThanFour = theSnipsThatAreBeingDisplayed?.length > 4;

	function handleTagClick(tag: Tag) {
		// filter the snips by the tag
		// if allSnips is defined, filter allSnips
		// if snips is defined, filter snips
		if (selectedTags.includes(tag.name)) {
			removeSelectedTag(tag.name);
		} else {
			addSelectedTag(tag.name);
		}
	}

	return (
		<header
			className={
				"flex sticky bg-gray-950 py-3 -mx-4 z-10" +
				(inYoutube ? "  top-[3.8rem]" : " top-0")
			}
		>
			<div className="flex mr-2 overflow-x-auto rounded-full scrollbar-hidden">
				<div className="flex pl-4"></div>
				{Array.from(tags).map((tag, index) => (
					<button
						key={index}
						onClick={() => handleTagClick(tag)}
						className={
							"rounded-3xl px-2 py-1 text-xs mr-2 self-center whitespace-nowrap hover:bg-gray-800 transition-colors duration-200 ease-in-out " +
							(selectedTags.includes(tag.name)
								? "bg-gray-800 text-gray-300"
								: "bg-gray-700 text-gray-400")
						}
					>
						{tag.name}
					</button>
				))}
			</div>
			{/* sort at the right corner */}
			<div
				className={`flex justify-end flex-1 gap-2 ${
					hasMoreThanFour ? "" : "pr-4"
				}`}
			>
				<ExportButton snips={theSnipsThatAreBeingDisplayed} />
				<SettingsButton
					stickRight={!hasMoreThanFour}
					takeUpFullHeight={takeUpFullHeight}
				/>
				{hasMoreThanFour && <Dropdown />}
			</div>
		</header>
	);
};

export default Header;
