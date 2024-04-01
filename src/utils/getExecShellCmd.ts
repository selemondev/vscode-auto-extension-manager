import { exec } from "child_process";

export const execShell = (cmd: string) =>
	new Promise<string>((resolve, reject) => {
		exec(cmd, (err, out) => {
			if (err) {
				reject(err);
			}
			return resolve(out);
		});
});