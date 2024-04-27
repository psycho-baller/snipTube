import {
	useState,
	useEffect,
	type FormEvent,
	type KeyboardEvent,
	type ChangeEvent,
} from "react";
import { getDefaultSnipLength, getShowOverlayOnNewSnip } from "~lib/storage";
import { useContentScriptStore } from "~stores/sniptube";
import DynamicTextarea from "../shared/components/DynamicTextarea";
import type { PlasmoCSConfig } from "plasmo";
import cssText from "data-text:src/styles/tailwind.css";
import TagInput from "src/shared/components/TagInput";
import { useStorage } from "@plasmohq/storage/hook";
export const getStyle = () => {
	const style = document.createElement("style");
	style.textContent = cssText;
	return style;
};
// TODO(fix): 🟠 WARN   | [plasmo/parcel-runtime]: Connection to the HMR server is closed
export const config: PlasmoCSConfig = {
	matches: [
		"https://youtube.com/watch*",
		"https://www.youtube.com/watch*",
		"https://youtu.be/*",
		"https://www.youtu.be/*",
		"https://www.youtube-nocookie.com/watch*",
		"https://youtube-nocookie.com/watch*",
		"https://www.youtube.com/embed/watch*",
		"https://youtube.com/embed/watch*",
		"https://*.youtube.com/watch*",
		"https://www.youtube-nocookie.com/embed/*",
	],
	run_at: "document_idle",
};
const AddSnipDetailsForm = () => {
	const [showAddSnipDetailsForm, setShowAddSnipDetailsForm] =
		useState<boolean>(false);
	const [note, setNote] = useState<string>("");
	const [tags, setTags] = useState<string[]>([]);

	const [snipLength, setSnipLength] = useState<number>(30);
	const show = useContentScriptStore((state) => state.showAddSnipDetailsForm);
	const [showAddSnipDetailsFormOnNewSnip, setShowAddSnipDetailsFormOnNewSnip] =
		useStorage("showAddSnipDetailsFormOnNewSnip", true);

	useEffect(() => {
		// new Promise<void>((resolve) => {
		// 	getShowOverlayOnNewSnip().then((showAddSnipDetailsFormOnNewSnip) => {
		// 		setShowAddSnipDetailsForm(showAddSnipDetailsFormOnNewSnip);
		// 		resolve();
		// 	});
		// });
		setShowAddSnipDetailsForm(showAddSnipDetailsFormOnNewSnip);

		// TODO: for some reason it doesn't the most up to date value (gotta refresh the page)
		// new Promise<void>((resolve) => {
		// 	getDefaultSnipLength().then((defaultLength) => {
		// 		setSnipLength(defaultLength);
		// 		resolve();
		// 	});
		// });
		getDefaultSnipLength().then((defaultLength) => {
			setSnipLength(defaultLength);
		});
	}, [showAddSnipDetailsFormOnNewSnip]);

	const cancelRequest = () => {
		useContentScriptStore.setState({
			showAddSnipDetailsForm: false,
			cancelSnipRequest: true,
		});
		// if the user no longer wants to add details to the snip, then we should update the storage
		if (!showAddSnipDetailsForm) {
			setShowAddSnipDetailsFormOnNewSnip(false);
		}
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		useContentScriptStore.setState({
			showAddSnipDetailsForm: false,
			snipNote: note,
			snipTags: tags,
			snipLength,
		});
		// reset the note and tags
		setNote("");
		setTags([]);
		// might actually be better to keep the snip length the same
		// setSnipLength(await getDefaultSnipLength());

		// if the user no longer wants to add details to the snip, then we should update the storage
		if (!showAddSnipDetailsForm) {
			setShowAddSnipDetailsFormOnNewSnip(false);
		}
	};

	const stopPropagation = (e: KeyboardEvent<HTMLElement>) => {
		// prevent from interacting with the video
		e.stopPropagation();
	};

	const handleLengthChange = (e: ChangeEvent<HTMLInputElement>) => {
		const length = Number.parseInt(e.target.value);
		setSnipLength(length);
	};

	// TODO: color? put AddSnipDetailsForm right above the snip in the video? Make sure it's small but also easily expandable to suit a small note and a large note
	return (
		<>
			{showAddSnipDetailsFormOnNewSnip ? (
				<main
					className={`flex z-50 items-center justify-center w-screen h-screen ${
						show ? "block" : "hidden"
					}`}
				>
					<form
						className="p-6 m-auto space-y-4 text-white bg-gray-800 w-96 rounded-xl"
						onSubmit={handleSubmit}
					>
						<h1 className="text-3xl font-bold text-center mx-aut">New Snip</h1>
						<div className="space-y-1">
							<label htmlFor="note" className="text-lg text-gray-200">
								Note
							</label>
							<DynamicTextarea
								id="note"
								note={note}
								setNote={setNote}
								onKeyDown={stopPropagation}
								className="px-3 py-2 text-xl"
							/>
						</div>
						<div className="space-y-1">
							<label htmlFor="tags" className="text-lg text-gray-200">
								Tags (separate with comma, tab, or enter)
							</label>
							<TagInput
								id="tags"
								tags={tags}
								setTags={setTags}
								placeholder="focus, productivity, ..."
							/>
						</div>
						<div className="">
							<label htmlFor="snipLength" className="text-lg text-gray-200">
								Snip Length
							</label>
							<div className="flex items-center mt-2 !ring-gray-600 hover:ring-2 rounded-lg">
								<input
									id="snipLength"
									type="number"
									className="w-24 form-input text-xl border-none !ring-0 rounded-l-lg bg-inherit focus:outline-none"
									value={snipLength}
									onChange={handleLengthChange}
									onKeyDown={stopPropagation}
									// onBlur={handleSave}
									min={20}
									max={120}
								/>
								<input
									type="range"
									className="w-full mr-3 focus:outline-none"
									value={snipLength}
									onChange={handleLengthChange}
									// onBlur={handleLengthChange}
									min={20}
									max={120}
								/>
							</div>
						</div>
						<div className="flex items-center pt-3 gap-x-4">
							<input
								id="addNoteAfterSaving"
								type="checkbox"
								checked={!showAddSnipDetailsForm}
								className="w-5 h-5 text-gray-500 bg-gray-700 border-gray-700 rounded form-checkbox focus:ring-gray-500 focus:ring-offset-gray-800 focus:outline-none"
								onChange={() =>
									setShowAddSnipDetailsForm(!showAddSnipDetailsForm)
								}
							/>
							<div className="">
								<label
									htmlFor="addNoteAfterSaving"
									className="text-lg text-gray-200"
								>
									Disable this popup next time
								</label>
								<div className="text-sm text-gray-400">
									You can modify this in the settings
								</div>
							</div>
						</div>
						<div className="flex justify-between pt-2">
							<button
								type="button"
								className="px-4 py-2 text-lg font-medium transition-colors border border-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-500"
								onClick={cancelRequest}
							>
								Close
							</button>
							<button
								type="submit"
								className="px-4 py-2 text-lg font-bold transition-colors bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-500"
							>
								Submit
							</button>
						</div>
					</form>
				</main>
			) : null}
		</>
	);
};

export default AddSnipDetailsForm;
