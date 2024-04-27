// TODO: add a button for the users to add their own button
import { useState, type FC, useEffect, type ChangeEvent, useMemo } from "react";
import {
	deleteAllDataFromStorage,
	getDefaultSnipLength,
	getPauseVideoOnNewSnip,
	getShowOverlayOnNewSnip,
	getUseKeyboardShortcut,
	setDefaultSnipLength,
	setPauseVideoOnNewSnip,
	setShowAddSnipDetailsFormOnNewSnip,
	setUseKeyboardShortcut,
} from "~lib/storage";
import { useAllSnipsStore, useSnipsStore } from "~stores/sniptube";
interface Props {
	className?: string;
	takeUpFullHeight?: boolean;
}

const SettingsForm: FC<Props> = (props) => {
	const { className, takeUpFullHeight } = props;

	const setAllSnips = useAllSnipsStore((state) => state.setSnips);
	const setSnips = useSnipsStore((state) => state.setSnips);

	// get viewport height

	const [
		showAddSnipDetailsFormOnNewSnipState,
		setShowAddSnipDetailsFormOnNewSnipState,
	] = useState<boolean>(true);
	const [pauseVideoOnNewSnipState, setPauseVideoOnNewSnipState] =
		useState<boolean>(true);
	const [useKeyboardShortcutState, setUseKeyboardShortcutState] =
		useState<boolean>(true);
	const [length, setLength] = useState<number>(30);

	const handleSave = async () => {
		console.log("autosave", length);
		await setDefaultSnipLength(length);
	};

	const handleLengthChange = async (e: ChangeEvent<HTMLInputElement>) => {
		setLength(Number.parseInt(e.target.value));
		// await setDefaultSnipLength(parseInt(e.target.value));
	};

	const handleShowOverlayOnNewSnipChange = async (
		e: ChangeEvent<HTMLInputElement>,
	) => {
		setShowAddSnipDetailsFormOnNewSnipState(e.target.checked);
		await setShowAddSnipDetailsFormOnNewSnip(e.target.checked);
	};

	const handlePauseVideoOnNewSnipChange = async (
		e: ChangeEvent<HTMLInputElement>,
	) => {
		setPauseVideoOnNewSnipState(e.target.checked);
		await setPauseVideoOnNewSnip(e.target.checked);
	};

	const handleUseKeyboardShortcutChange = async (
		e: ChangeEvent<HTMLInputElement>,
	) => {
		setUseKeyboardShortcutState(e.target.checked);
		await setUseKeyboardShortcut(e.target.checked);
	};

	useEffect(() => {
		new Promise<number>((resolve) => {
			getDefaultSnipLength().then((length) => {
				console.log("length", length);
				setLength(length);
				resolve(length);
			});
		});

		new Promise<boolean>((resolve) => {
			getShowOverlayOnNewSnip().then((show) => {
				setShowAddSnipDetailsFormOnNewSnipState(show);
				resolve(show);
			});
		});

		new Promise<boolean>((resolve) => {
			getPauseVideoOnNewSnip().then((pause) => {
				setPauseVideoOnNewSnipState(pause);
				resolve(pause);
			});
		});

		new Promise<boolean>((resolve) => {
			getUseKeyboardShortcut().then((use) => {
				setUseKeyboardShortcutState(use);
				resolve(use);
			});
		});
	}, []);

	async function deleteAllData() {
		await deleteAllDataFromStorage();
		setAllSnips([]);
		setSnips([]);
	}

	return (
		<section className={className}>
			<div
				className={
					"overflow-scroll flex flex-col gap-y-6 px-4 pt-2 pb-4 " +
					(takeUpFullHeight ? "" : "max-h-[22.5rem]")
				}
			>
				<div className="flex items-center justify-between">
					{/* keep in single line:  overflow-ellipsis whitespace-nowrap  */}
					<h2 className="-mb-2 overflow-hidden text-2xl font-medium">
						Settings
					</h2>
					{/* <button
            type="button"
            className="text-gray-500 bg-transparent hover:text-gray-700"
            aria-label="Add Note After Saving Snip Info"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              ?
            </svg>
          </button> */}
				</div>
				<div className="">
					<label htmlFor="useKeyboardShortcut" className="text-base">
						Create snip with the 's' key
					</label>
					<div className="flex items-center mt-2">
						<input
							id="useKeyboardShortcut"
							type="checkbox"
							checked={useKeyboardShortcutState}
							className="w-4 h-4 text-gray-500 bg-gray-700 border-gray-700 rounded form-checkbox focus:ring-gray-500 focus:ring-offset-gray-800 focus:outline-none"
							onChange={handleUseKeyboardShortcutChange}
						/>
						{/* <label
              htmlFor="addNoteAfterSaving"
              className="ml-2"
            >
              Enable
            </label> */}
					</div>
				</div>
				<div className="">
					<label htmlFor="addNoteAfterSaving" className="text-base">
						Add note when creating a snip
					</label>
					<div className="text-xs text-gray-400">
						Enabling this will show a popup when you create a snip
					</div>
					<div className="flex items-center mt-2">
						<input
							id="addNoteAfterSaving"
							type="checkbox"
							checked={showAddSnipDetailsFormOnNewSnipState}
							className="w-4 h-4 text-gray-500 bg-gray-700 border-gray-700 rounded form-checkbox focus:ring-gray-500 focus:ring-offset-gray-800 focus:outline-none"
							onChange={handleShowOverlayOnNewSnipChange}
						/>
						{/* <label
              htmlFor="addNoteAfterSaving"
              className="ml-2"
            >
              Enable
            </label> */}
					</div>
				</div>
				<div
					className={
						"" + (showAddSnipDetailsFormOnNewSnipState ? " " : " hidden")
					}
				>
					<label
						htmlFor="showAddSnipDetailsFormOnNewSnip"
						className="text-base"
					>
						Pause video when creating snip
					</label>
					<div className="flex items-center mt-2">
						<input
							id="showAddSnipDetailsFormOnNewSnip"
							checked={pauseVideoOnNewSnipState}
							type="checkbox"
							className="w-4 h-4 text-gray-500 bg-gray-700 border-gray-700 rounded form-checkbox focus:ring-gray-500 focus:ring-offset-gray-800 focus:outline-none"
							onChange={handlePauseVideoOnNewSnipChange}
						/>
						{/* <label
              htmlFor="showAddSnipDetailsFormOnNewSnip"
              className="ml-2"
            >
              Enable
            </label> */}
					</div>
				</div>
				<div className="">
					<label htmlFor="defaultSnipLength" className="text-base">
						Default Snip Length
					</label>
					<div className="flex items-center mt-2 !ring-gray-600 hover:ring-2 rounded-lg">
						<input
							id="defaultSnipLength"
							type="number"
							className="w-16 form-input border-none !ring-0 rounded-l-lg bg-inherit focus:outline-none"
							value={length}
							onChange={handleLengthChange}
							onBlur={handleSave}
							min={20}
							max={120}
						/>
						<input
							type="range"
							className="w-full mr-3 focus:outline-none"
							value={length}
							onChange={handleLengthChange}
							onBlur={handleSave}
							min={20}
							max={120}
						/>
					</div>
				</div>
				<div className="flex flex-col">
					<h3 className="text-lg font-medium pb-1">Danger Zone</h3>
					<button
						type="button"
						className="w-full px-4 py-2 mt-2 text-sm font-medium text-red-500 bg-transparent border border-red-500 rounded-md hover:bg-red-500 hover:text-white transition-all duration-200 ease-in-out"
						aria-label="Erase all data"
						onClick={deleteAllData}
					>
						Reset all your app data
					</button>
				</div>
			</div>
		</section>
	);
};

export default SettingsForm;
