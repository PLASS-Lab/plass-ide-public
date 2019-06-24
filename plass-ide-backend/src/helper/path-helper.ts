import {join} from "path";
import { readdirSync, statSync, readFileSync } from "fs";

import { IFile } from "../types";

// 파일 저장 디렉토리
const fileDir = join(__dirname, "../../files");

// get path 
export function getUserPath({username, path}: {username: string, path: string}) {
    return `${fileDir}/${username}/${path}`;
}

/**
 * get all files in directory
 * implments by recursive function
 */
interface IOption {
    data: boolean;
}

export function getFiles(path: string, option: IOption={data: false}): Array<IFile> {
    function _getFiles(path: string, subpath: string=""): Array<IFile> {
        const result = readdirSync(path);
        const files: Array<IFile> = result.map((name: string):IFile => {
            const _path = `${path}/${name}`;
            const state = statSync(_path);
            const isDirectory = state.isDirectory();
    
            const file: IFile = { name, isDirectory, path: subpath };
    
            if(isDirectory) {
                file.files = _getFiles(_path, subpath + name);
            } else {
                file.size = state.size;
                const lastIndex = name.lastIndexOf(".");
                if(lastIndex != -1) {
                    file.ext = name.substring(lastIndex + 1);
                }

                if(option.data) {
                    const filebuffer = readFileSync(_path);
                    file.data = filebuffer.toString('utf8');
                }
            }
    
            return file;
        });
    
        return files
    }

    return _getFiles(path);
}