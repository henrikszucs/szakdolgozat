"use strict";
{
    //Path library
    const getPathLibrary = function() {
        //OWN solutions for win32 integration
        function win32ToPosix(path) {
            let type = 0; // 0-none, 1-relative, 2-absolute-letter, 3-absolute-other

            let regex;
            //start douple slash
            regex = new RegExp("^\\\\\\\\|^\\/\\/");
            if (regex.test(path)) {
                type = 3;
                path = path.replaceAll("/", "\\");
            } else {
                // drive letter
                regex = new RegExp("^(\\w*):");
                if (regex.test(path)) {
                    type = 2;
                } else {
                    //any backlash
                    regex = new RegExp("\\\\");
                    if (regex.test(path)) {
                        type = 1;
                    }
                }
            }
            if (type !== 0) {
                path = path.replace(/^(\w*):|\\+/g,"/$1");
            }
            return [path, type];
            
        }
        function posixToWin32(path, type) {
            if (path !== "/") {
                if (type === 1) {
                    path = path.replaceAll("/", "\\");
                } else if (type === 2) {
                    const split = path.split("/");
                    split.splice(0, 1);
                    split[0] = split[0] + ":";
                    path = split.join("\\");
                } else if (type === 3) {
                    path = "\\" + path.replaceAll("/", "\\");
                }
            } else {
                path = "";
            }
            return path;
        }


        // 'path' module extracted from Node.js v8.11.1 (only the posix part)
        // transplited with Babel

        // Copyright Joyent, Inc. and other Node contributors.
        //
        // Permission is hereby granted, free of charge, to any person obtaining a
        // copy of this software and associated documentation files (the
        // "Software"), to deal in the Software without restriction, including
        // without limitation the rights to use, copy, modify, merge, publish,
        // distribute, sublicense, and/or sell copies of the Software, and to permit
        // persons to whom the Software is furnished to do so, subject to the
        // following conditions:
        //
        // The above copyright notice and this permission notice shall be included
        // in all copies or substantial portions of the Software.
        //
        // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
        // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
        // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
        // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
        // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
        // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
        // USE OR OTHER DEALINGS IN THE SOFTWARE.

        function assertPath(path) {
            if (typeof path !== 'string') {
                throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
            }
        }

        // Resolves . and .. elements in a path with directory names
        function normalizeStringPosix(path, allowAboveRoot) {
            let res = '';
            let lastSegmentLength = 0;
            let lastSlash = -1;
            let dots = 0;
            let code;
            for (let i = 0; i <= path.length; ++i) {
                if (i < path.length)
                    code = path.charCodeAt(i);
                else if (code === 47 /*/*/ )
                    break;
                else
                    code = 47 /*/*/ ;
                if (code === 47 /*/*/ ) {
                    if (lastSlash === i - 1 || dots === 1) {
                        // NOOP
                    } else if (lastSlash !== i - 1 && dots === 2) {
                        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 /*.*/ || res.charCodeAt(res.length - 2) !== 46 /*.*/ ) {
                            if (res.length > 2) {
                                let lastSlashIndex = res.lastIndexOf('/');
                                if (lastSlashIndex !== res.length - 1) {
                                    if (lastSlashIndex === -1) {
                                        res = '';
                                        lastSegmentLength = 0;
                                    } else {
                                        res = res.slice(0, lastSlashIndex);
                                        lastSegmentLength = res.length - 1 - res.lastIndexOf('/');
                                    }
                                    lastSlash = i;
                                    dots = 0;
                                    continue;
                                }
                            } else if (res.length === 2 || res.length === 1) {
                                res = '';
                                lastSegmentLength = 0;
                                lastSlash = i;
                                dots = 0;
                                continue;
                            }
                        }
                        if (allowAboveRoot) {
                            if (res.length > 0)
                                res += '/..';
                            else
                                res = '..';
                            lastSegmentLength = 2;
                        }
                    } else {
                        if (res.length > 0)
                            res += '/' + path.slice(lastSlash + 1, i);
                        else
                            res = path.slice(lastSlash + 1, i);
                        lastSegmentLength = i - lastSlash - 1;
                    }
                    lastSlash = i;
                    dots = 0;
                } else if (code === 46 /*.*/ && dots !== -1) {
                    ++dots;
                } else {
                    dots = -1;
                }
            }
            return res;
        }

        function _format(sep, pathObject) {
            let dir = pathObject.dir || pathObject.root;
            let base = pathObject.base || (pathObject.name || '') + (pathObject.ext || '');
            if (!dir) {
                return base;
            }
            if (dir === pathObject.root) {
                return dir + base;
            }
            return dir + sep + base;
        }

        let posix = {
            // path.resolve([from ...], to)
            resolve: function resolve() {
                let resolvedPath = '';
                let resolvedAbsolute = false;
                let cwd;

                for (let i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
                    let path;
                    if (i >= 0)
                        path = arguments[i];
                    else {
                        if (cwd === undefined)
                            cwd = process.cwd();
                        path = cwd;
                    }

                    assertPath(path);

                    // Skip empty entries
                    if (path.length === 0) {
                        continue;
                    }

                    resolvedPath = path + '/' + resolvedPath;
                    resolvedAbsolute = path.charCodeAt(0) === 47 /*/*/ ;
                }

                // At this point the path should be resolved to a full absolute path, but
                // handle relative paths to be safe (might happen when process.cwd() fails)

                // Normalize the path
                resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);

                if (resolvedAbsolute) {
                    if (resolvedPath.length > 0)
                        return '/' + resolvedPath;
                    else
                        return '/';
                } else if (resolvedPath.length > 0) {
                    return resolvedPath;
                } else {
                    return '.';
                }
            },

            normalize: function normalize(path) {
                assertPath(path);
                const convert = win32ToPosix(path); //OWN hack
                path = convert[0]; //OWN hack

                if (path.length === 0) return '.';

                let isAbsolute = path.charCodeAt(0) === 47 /*/*/ ;
                let trailingSeparator = path.charCodeAt(path.length - 1) === 47 /*/*/ ;

                // Normalize the path
                path = normalizeStringPosix(path, !isAbsolute);

                if (path.length === 0 && !isAbsolute) path = '.';
                if (path.length > 0 && trailingSeparator) path += '/';

                if (isAbsolute) path = '/' + path;
                return posixToWin32(path, convert[1]);
            },

            isAbsolute: function isAbsolute(path) {
                assertPath(path);
                path = win32ToPosix(path)[0]; //OWN hack
                return path.length > 0 && path.charCodeAt(0) === 47 /*/*/ ;
            },

            join: function join() {
                if (arguments.length === 0)
                    return '.';
                let joined;
                for (let i = 0, length = arguments.length; i < length; ++i) {
                    let arg = arguments[i];
                    assertPath(arg);
                    if (arg.length > 0) {
                        if (joined === undefined)
                            joined = arg;
                        else
                            joined += '/' + arg;
                    }
                }
                if (joined === undefined)
                    return '.';
                return posix.normalize(joined);
            },

            relative: function relative(from, to) {
                assertPath(from);
                assertPath(to);

                if (from === to) return '';

                from = posix.resolve(from);
                to = posix.resolve(to);

                if (from === to) return '';

                // Trim any leading backslashes
                let fromStart = 1;
                for (; fromStart < from.length; ++fromStart) {
                    if (from.charCodeAt(fromStart) !== 47 /*/*/ )
                        break;
                }
                let fromEnd = from.length;
                let fromLen = fromEnd - fromStart;

                // Trim any leading backslashes
                let toStart = 1;
                for (; toStart < to.length; ++toStart) {
                    if (to.charCodeAt(toStart) !== 47 /*/*/ )
                        break;
                }
                let toEnd = to.length;
                let toLen = toEnd - toStart;

                // Compare paths to find the longest common path from root
                let length = fromLen < toLen ? fromLen : toLen;
                let lastCommonSep = -1;
                let i = 0;
                for (; i <= length; ++i) {
                    if (i === length) {
                        if (toLen > length) {
                            if (to.charCodeAt(toStart + i) === 47 /*/*/ ) {
                                // We get here if `from` is the exact base path for `to`.
                                // For example: from='/foo/bar'; to='/foo/bar/baz'
                                return to.slice(toStart + i + 1);
                            } else if (i === 0) {
                                // We get here if `from` is the root
                                // For example: from='/'; to='/foo'
                                return to.slice(toStart + i);
                            }
                        } else if (fromLen > length) {
                            if (from.charCodeAt(fromStart + i) === 47 /*/*/ ) {
                                // We get here if `to` is the exact base path for `from`.
                                // For example: from='/foo/bar/baz'; to='/foo/bar'
                                lastCommonSep = i;
                            } else if (i === 0) {
                                // We get here if `to` is the root.
                                // For example: from='/foo'; to='/'
                                lastCommonSep = 0;
                            }
                        }
                        break;
                    }
                    let fromCode = from.charCodeAt(fromStart + i);
                    let toCode = to.charCodeAt(toStart + i);
                    if (fromCode !== toCode)
                        break;
                    else if (fromCode === 47 /*/*/ )
                        lastCommonSep = i;
                }

                let out = '';
                // Generate the relative path based on the path difference between `to`
                // and `from`
                for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
                    if (i === fromEnd || from.charCodeAt(i) === 47 /*/*/ ) {
                        if (out.length === 0)
                            out += '..';
                        else
                            out += '/..';
                    }
                }

                // Lastly, append the rest of the destination (`to`) path that comes after
                // the common path parts
                if (out.length > 0)
                    return out + to.slice(toStart + lastCommonSep);
                else {
                    toStart += lastCommonSep;
                    if (to.charCodeAt(toStart) === 47 /*/*/ )
                        ++toStart;
                    return to.slice(toStart);
                }
            },

            _makeLong: function _makeLong(path) {
                return path;
            },

            dirname: function dirname(path) {
                assertPath(path);
                const convert = win32ToPosix(path) //OWN hack
                path = convert[0];
                if (path.length === 0) return '.';
                let code = path.charCodeAt(0);
                let hasRoot = code === 47 /*/*/ ;
                let end = -1;
                let matchedSlash = true;
                for (let i = path.length - 1; i >= 1; --i) {
                    code = path.charCodeAt(i);
                    if (code === 47 /*/*/ ) {
                        if (!matchedSlash) {
                            end = i;
                            break;
                        }
                    } else {
                        // We saw the first non-path separator
                        matchedSlash = false;
                    }
                }

                if (end === -1) return hasRoot ? '/' : '.';
                if (hasRoot && end === 1) return '//';

                path = path.slice(0, end); 
                path = posixToWin32(path, convert[1])//OWN hack
                return path;
            },

            basename: function basename(path, ext) {
                if (ext !== undefined && typeof ext !== 'string') throw new TypeError('"ext" argument must be a string');
                assertPath(path);
                path = win32ToPosix(path)[0] //OWN hack

                let start = 0;
                let end = -1;
                let matchedSlash = true;
                let i;

                if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
                    if (ext.length === path.length && ext === path) return '';
                    let extIdx = ext.length - 1;
                    let firstNonSlashEnd = -1;
                    for (i = path.length - 1; i >= 0; --i) {
                        let code = path.charCodeAt(i);
                        if (code === 47 /*/*/ ) {
                            // If we reached a path separator that was not part of a set of path
                            // separators at the end of the string, stop now
                            if (!matchedSlash) {
                                start = i + 1;
                                break;
                            }
                        } else {
                            if (firstNonSlashEnd === -1) {
                                // We saw the first non-path separator, remember this index in case
                                // we need it if the extension ends up not matching
                                matchedSlash = false;
                                firstNonSlashEnd = i + 1;
                            }
                            if (extIdx >= 0) {
                                // Try to match the explicit extension
                                if (code === ext.charCodeAt(extIdx)) {
                                    if (--extIdx === -1) {
                                        // We matched the extension, so mark this as the end of our path
                                        // component
                                        end = i;
                                    }
                                } else {
                                    // Extension does not match, so our result is the entire path
                                    // component
                                    extIdx = -1;
                                    end = firstNonSlashEnd;
                                }
                            }
                        }
                    }

                    if (start === end) end = firstNonSlashEnd;
                    else if (end === -1) end = path.length;
                    return path.slice(start, end);
                } else {
                    for (i = path.length - 1; i >= 0; --i) {
                        if (path.charCodeAt(i) === 47 /*/*/ ) {
                            // If we reached a path separator that was not part of a set of path
                            // separators at the end of the string, stop now
                            if (!matchedSlash) {
                                start = i + 1;
                                break;
                            }
                        } else if (end === -1) {
                            // We saw the first non-path separator, mark this as the end of our
                            // path component
                            matchedSlash = false;
                            end = i + 1;
                        }
                    }

                    if (end === -1) return '';
                    return path.slice(start, end);
                }
            },

            extname: function extname(path) {
                assertPath(path);
                path = win32ToPosix(path)[0] //OWN hack
                let startDot = -1;
                let startPart = 0;
                let end = -1;
                let matchedSlash = true;
                // Track the state of characters (if any) we see before our first dot and
                // after any path separator we find
                let preDotState = 0;
                for (let i = path.length - 1; i >= 0; --i) {
                    let code = path.charCodeAt(i);
                    if (code === 47 /*/*/ ) {
                        // If we reached a path separator that was not part of a set of path
                        // separators at the end of the string, stop now
                        if (!matchedSlash) {
                            startPart = i + 1;
                            break;
                        }
                        continue;
                    }
                    if (end === -1) {
                        // We saw the first non-path separator, mark this as the end of our
                        // extension
                        matchedSlash = false;
                        end = i + 1;
                    }
                    if (code === 46 /*.*/ ) {
                        // If this is our first dot, mark it as the start of our extension
                        if (startDot === -1)
                            startDot = i;
                        else if (preDotState !== 1)
                            preDotState = 1;
                    } else if (startDot !== -1) {
                        // We saw a non-dot and non-path separator before our dot, so we should
                        // have a good chance at having a non-empty extension
                        preDotState = -1;
                    }
                }

                if (startDot === -1 || end === -1 ||
                    // We saw a non-dot character immediately before the dot
                    preDotState === 0 ||
                    // The (right-most) trimmed path component is exactly '..'
                    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
                    return '';
                }
                return path.slice(startDot, end);
            },

            format: function format(pathObject) {
                if (pathObject === null || typeof pathObject !== 'object') {
                    throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
                }
                return _format('/', pathObject);
            },

            parse: function parse(path) {
                assertPath(path);

                let ret = {
                    root: '',
                    dir: '',
                    base: '',
                    ext: '',
                    name: ''
                };
                if (path.length === 0) return ret;
                let code = path.charCodeAt(0);
                let isAbsolute = code === 47 /*/*/ ;
                let start;
                if (isAbsolute) {
                    ret.root = '/';
                    start = 1;
                } else {
                    start = 0;
                }
                let startDot = -1;
                let startPart = 0;
                let end = -1;
                let matchedSlash = true;
                let i = path.length - 1;

                // Track the state of characters (if any) we see before our first dot and
                // after any path separator we find
                let preDotState = 0;

                // Get non-dir info
                for (; i >= start; --i) {
                    code = path.charCodeAt(i);
                    if (code === 47 /*/*/ ) {
                        // If we reached a path separator that was not part of a set of path
                        // separators at the end of the string, stop now
                        if (!matchedSlash) {
                            startPart = i + 1;
                            break;
                        }
                        continue;
                    }
                    if (end === -1) {
                        // We saw the first non-path separator, mark this as the end of our
                        // extension
                        matchedSlash = false;
                        end = i + 1;
                    }
                    if (code === 46 /*.*/ ) {
                        // If this is our first dot, mark it as the start of our extension
                        if (startDot === -1) startDot = i;
                        else if (preDotState !== 1) preDotState = 1;
                    } else if (startDot !== -1) {
                        // We saw a non-dot and non-path separator before our dot, so we should
                        // have a good chance at having a non-empty extension
                        preDotState = -1;
                    }
                }

                if (startDot === -1 || end === -1 ||
                    // We saw a non-dot character immediately before the dot
                    preDotState === 0 ||
                    // The (right-most) trimmed path component is exactly '..'
                    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
                    if (end !== -1) {
                        if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);
                        else ret.base = ret.name = path.slice(startPart, end);
                    }
                } else {
                    if (startPart === 0 && isAbsolute) {
                        ret.name = path.slice(1, startDot);
                        ret.base = path.slice(1, end);
                    } else {
                        ret.name = path.slice(startPart, startDot);
                        ret.base = path.slice(startPart, end);
                    }
                    ret.ext = path.slice(startDot, end);
                }

                if (startPart > 0) ret.dir = path.slice(0, startPart - 1);
                else if (isAbsolute) ret.dir = '/';

                return ret;
            },

            

            sep: '/',
            delimiter: ':',
        };
        return {
            isAbsolute: posix.isAbsolute,
            join: posix.join,
            normalize: posix.normalize,
            dirname: posix.dirname,
            basename: posix.basename,
            extname: posix.extname
        };
    };
    const pathLib = getPathLibrary();
    //Disk space library
    const getDiskSpaceCheckLibrary = function(dependencies) {
        /*
            MIT License

            Copyright (c) 2017-2019 Alexandre Demode

            Permission is hereby granted, free of charge, to any person obtaining a copy
            of this software and associated documentation files (the "Software"), to deal
            in the Software without restriction, including without limitation the rights
            to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
            copies of the Software, and to permit persons to whom the Software is
            furnished to do so, subject to the following conditions:

            The above copyright notice and this permission notice shall be included in all
            copies or substantial portions of the Software.

            THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
            IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
            FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
            AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
            LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
            OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
            SOFTWARE.
        */
        if (typeof dependencies === "undefined") {
            const { execFile, execFileSync } = require("child_process");
            const { existsSync } = require("fs");
            const { release } = require("os");
            const { normalize, sep } = require("path");
            dependencies = {
                platform: process.platform,
                release: release(),
                fsExistsSync: existsSync,
                pathNormalize: normalize,
                pathSep: sep,
                cpExecFile: execFile,
                cpExecFileSync: execFileSync,
            };
        }
        
        function checkDiskSpace(directoryPath){
            function getFirstExistingParentPath(directoryPath, dependencies) {
                let parentDirectoryPath = directoryPath;
                let parentDirectoryFound = dependencies.fsExistsSync(parentDirectoryPath);
        
                while (!parentDirectoryFound) {
                    parentDirectoryPath = dependencies.pathNormalize(parentDirectoryPath + '/..');
                    parentDirectoryFound = dependencies.fsExistsSync(parentDirectoryPath);
                }
        
                return parentDirectoryPath;
            }
        
            function hasPowerShell3(dependencies) {
                const major = parseInt(dependencies.release.split('.')[0], 10);
        
                if (major > 6) {
                    try {
                        dependencies.cpExecFileSync('powershell');
                        return true;
                    } catch (err) {
                        return false;
                    }
                } else {
                    return false;
                }
            }
            
            /**
             * Maps command output to a normalized object {diskPath, free, size}
             *
             * @param stdout - The command output
             * @param filter - To filter drives (only used for win32)
             * @param mapping - Map between column index and normalized column name
             * @param coefficient - The size coefficient to get bytes instead of kB
             */
            function mapOutput(stdout, filter, mapping, coefficient){
                const parsed = stdout.trim().split('\n').slice(1).map(line => {
                    return line.trim().split(/\s+(?=[\d/])/);
                })
        
                const filtered = parsed.filter(filter);
        
                if (filtered.length === 0) {
                    throw new Error("No match");
                }
        
                const diskData = filtered[0];
        
                return {
                    diskPath: diskData[mapping.diskPath],
                    free: parseInt(diskData[mapping.free], 10) * coefficient,
                    size: parseInt(diskData[mapping.size], 10) * coefficient,
                };
            }
        
            /**
             * Run the command and do common things between win32 and unix
             *
             * @param cmd - The command to execute
             * @param filter - To filter drives (only used for win32)
             * @param mapping - Map between column index and normalized column name
             * @param coefficient - The size coefficient to get bytes instead of kB
             */
            function check(cmd, filter, mapping, coefficient = 1){
                return new Promise((resolve, reject) => {
                    const [file, ...args] = cmd;
        
                    /* istanbul ignore if */
                    if (file === undefined) {
                        return Promise.reject(new Error('cmd must contain at least one item'));
                    }
        
                    dependencies.cpExecFile(file, args, (error, stdout) => {
                        if (error) {
                            reject(error);
                        }
        
                        try {
                            resolve(mapOutput(stdout, filter, mapping, coefficient));
                        } catch (error2) {
                            reject(error2);
                        }
                    })
                })
            }
        
            /**
             * Build the check call for win32
             *
             * @param directoryPath - The file/folder path from where we want to know disk space
             */
            function checkWin32(directoryPath){
                if (directoryPath.charAt(1) !== ':') {
                    return new Promise((resolve, reject) => {
                        reject(`The following path is invalid (should be X:\\...): ${directoryPath}`);
                    })
                }
        
                const powershellCmd = [
                    'powershell',
                    'Get-CimInstance -ClassName Win32_LogicalDisk | Select-Object Caption, FreeSpace, Size',
                ];
                const wmicCmd = [
                    'wmic',
                    'logicaldisk',
                    'get',
                    'size,freespace,caption',
                ];
                const cmd = hasPowerShell3(dependencies) ? powershellCmd : wmicCmd;
        
                return check(
                    cmd,
                    driveData => {
                        // Only get the drive which match the path
                        const driveLetter = driveData[0]
                        return directoryPath.toUpperCase().startsWith(driveLetter.toUpperCase())
                    }, {
                        diskPath: 0,
                        free: 1,
                        size: 2,
                    },
                );
            }
        
            /**
             * Build the check call for unix
             *
             * @param directoryPath - The file/folder path from where we want to know disk space
             */
            function checkUnix(directoryPath){
                if (!dependencies.pathNormalize(directoryPath).startsWith(dependencies.pathSep)) {
                    return new Promise((resolve, reject) => {
                        reject(`The following path is invalid (should start by ${dependencies.pathSep}): ${directoryPath}`);
                    })
                }
        
                const pathToCheck = getFirstExistingParentPath(directoryPath, dependencies);
        
                return check(
                    [
                        'df',
                        '-Pk',
                        '--',
                        pathToCheck,
                    ],
                    () => true, // We should only get one line, so we did not need to filter
                    {
                        diskPath: 5,
                        free: 3,
                        size: 1,
                    },
                    1024, // We get sizes in kB, we need to convert that to bytes
                )
            }
            
            // Call the right check depending on the OS
            if (dependencies.platform === 'win32') {
                return checkWin32(directoryPath);
            }
        
            return checkUnix(directoryPath);
        };
        return checkDiskSpace;
    };
    //MIME type DB
    const typeDB = {
        "application/andrew-inset":["ez"],"application/applixware":["aw"],"application/atom+xml":["atom"],"application/atomcat+xml":["atomcat"],"application/atomdeleted+xml":["atomdeleted"],"application/atomsvc+xml":["atomsvc"],"application/atsc-dwd+xml":["dwd"],"application/atsc-held+xml":["held"],"application/atsc-rsat+xml":["rsat"],"application/bdoc":["bdoc"],"application/calendar+xml":["xcs"],"application/ccxml+xml":["ccxml"],"application/cdfx+xml":["cdfx"],"application/cdmi-capability":["cdmia"],"application/cdmi-container":["cdmic"],"application/cdmi-domain":["cdmid"],"application/cdmi-object":["cdmio"],"application/cdmi-queue":["cdmiq"],"application/cpl+xml":["cpl"],"application/cu-seeme":["cu"],"application/cwl":["cwl"],"application/dash+xml":["mpd"],"application/dash-patch+xml":["mpp"],"application/davmount+xml":["davmount"],"application/docbook+xml":["dbk"],"application/dssc+der":["dssc"],"application/dssc+xml":["xdssc"],"application/ecmascript":["ecma"],"application/emma+xml":["emma"],"application/emotionml+xml":["emotionml"],"application/epub+zip":["epub"],"application/exi":["exi"],"application/express":["exp"],"application/fdf":["fdf"],"application/fdt+xml":["fdt"],"application/font-tdpfr":["pfr"],"application/geo+json":["geojson"],"application/gml+xml":["gml"],"application/gpx+xml":["gpx"],"application/gxf":["gxf"],"application/gzip":["gz"],"application/hjson":["hjson"],"application/hyperstudio":["stk"],"application/inkml+xml":["ink","inkml"],"application/ipfix":["ipfix"],"application/its+xml":["its"],"application/java-archive":["jar","war","ear"],"application/java-serialized-object":["ser"],"application/java-vm":["class"],"application/javascript":["js"],"application/json":["json","map"],"application/json5":["json5"],"application/jsonml+json":["jsonml"],"application/ld+json":["jsonld"],"application/lgr+xml":["lgr"],"application/lost+xml":["lostxml"],"application/mac-binhex40":["hqx"],"application/mac-compactpro":["cpt"],"application/mads+xml":["mads"],"application/manifest+json":["webmanifest"],"application/marc":["mrc"],"application/marcxml+xml":["mrcx"],"application/mathematica":["ma","nb","mb"],"application/mathml+xml":["mathml"],"application/mbox":["mbox"],"application/media-policy-dataset+xml":["mpf"],"application/mediaservercontrol+xml":["mscml"],"application/metalink+xml":["metalink"],"application/metalink4+xml":["meta4"],"application/mets+xml":["mets"],"application/mmt-aei+xml":["maei"],"application/mmt-usd+xml":["musd"],"application/mods+xml":["mods"],"application/mp21":["m21","mp21"],"application/mp4":["mp4s","m4p"],"application/msword":["doc","dot"],"application/mxf":["mxf"],"application/n-quads":["nq"],"application/n-triples":["nt"],"application/node":["cjs"],"application/octet-stream":["bin","dms","lrf","mar","so","dist","distz","pkg","bpk","dump","elc","deploy","exe","dll","deb","dmg","iso","img","msi","msp","msm","buffer"],"application/oda":["oda"],"application/oebps-package+xml":["opf"],"application/ogg":["ogx"],"application/omdoc+xml":["omdoc"],"application/onenote":["onetoc","onetoc2","onetmp","onepkg"],"application/oxps":["oxps"],"application/p2p-overlay+xml":["relo"],"application/patch-ops-error+xml":["xer"],"application/pdf":["pdf"],"application/pgp-encrypted":["pgp"],"application/pgp-keys":["asc"],"application/pgp-signature":["sig","asc"],"application/pics-rules":["prf"],"application/pkcs10":["p10"],"application/pkcs7-mime":["p7m","p7c"],"application/pkcs7-signature":["p7s"],"application/pkcs8":["p8"],"application/pkix-attr-cert":["ac"],"application/pkix-cert":["cer"],"application/pkix-crl":["crl"],"application/pkix-pkipath":["pkipath"],"application/pkixcmp":["pki"],"application/pls+xml":["pls"],"application/postscript":["ai","eps","ps"],"application/provenance+xml":["provx"],"application/prs.cww":["cww"],"application/prs.xsf+xml":["xsf"],"application/pskc+xml":["pskcxml"],"application/raml+yaml":["raml"],"application/rdf+xml":["rdf","owl"],"application/reginfo+xml":["rif"],"application/relax-ng-compact-syntax":["rnc"],"application/resource-lists+xml":["rl"],"application/resource-lists-diff+xml":["rld"],"application/rls-services+xml":["rs"],"application/route-apd+xml":["rapd"],"application/route-s-tsid+xml":["sls"],"application/route-usd+xml":["rusd"],"application/rpki-ghostbusters":["gbr"],"application/rpki-manifest":["mft"],"application/rpki-roa":["roa"],"application/rsd+xml":["rsd"],"application/rss+xml":["rss"],"application/rtf":["rtf"],"application/sbml+xml":["sbml"],"application/scvp-cv-request":["scq"],"application/scvp-cv-response":["scs"],"application/scvp-vp-request":["spq"],"application/scvp-vp-response":["spp"],"application/sdp":["sdp"],"application/senml+xml":["senmlx"],"application/sensml+xml":["sensmlx"],"application/set-payment-initiation":["setpay"],"application/set-registration-initiation":["setreg"],"application/shf+xml":["shf"],"application/sieve":["siv","sieve"],"application/smil+xml":["smi","smil"],"application/sparql-query":["rq"],"application/sparql-results+xml":["srx"],"application/srgs":["gram"],"application/srgs+xml":["grxml"],"application/sru+xml":["sru"],"application/ssdl+xml":["ssdl"],"application/ssml+xml":["ssml"],"application/swid+xml":["swidtag"],"application/tei+xml":["tei","teicorpus"],"application/thraud+xml":["tfi"],"application/timestamped-data":["tsd"],"application/toml":["toml"],"application/trig":["trig"],"application/ttml+xml":["ttml"],"application/ubjson":["ubj"],"application/urc-ressheet+xml":["rsheet"],"application/urc-targetdesc+xml":["td"],"application/vnd.1000minds.decision-model+xml":["1km"],"application/vnd.3gpp.pic-bw-large":["plb"],"application/vnd.3gpp.pic-bw-small":["psb"],"application/vnd.3gpp.pic-bw-var":["pvb"],"application/vnd.3gpp2.tcap":["tcap"],"application/vnd.3m.post-it-notes":["pwn"],"application/vnd.accpac.simply.aso":["aso"],"application/vnd.accpac.simply.imp":["imp"],"application/vnd.acucobol":["acu"],"application/vnd.acucorp":["atc","acutc"],"application/vnd.adobe.air-application-installer-package+zip":["air"],"application/vnd.adobe.formscentral.fcdt":["fcdt"],"application/vnd.adobe.fxp":["fxp","fxpl"],"application/vnd.adobe.xdp+xml":["xdp"],"application/vnd.adobe.xfdf":["xfdf"],"application/vnd.age":["age"],"application/vnd.ahead.space":["ahead"],"application/vnd.airzip.filesecure.azf":["azf"],"application/vnd.airzip.filesecure.azs":["azs"],"application/vnd.amazon.ebook":["azw"],"application/vnd.americandynamics.acc":["acc"],"application/vnd.amiga.ami":["ami"],"application/vnd.android.package-archive":["apk"],"application/vnd.anser-web-certificate-issue-initiation":["cii"],"application/vnd.anser-web-funds-transfer-initiation":["fti"],"application/vnd.antix.game-component":["atx"],"application/vnd.apple.installer+xml":["mpkg"],"application/vnd.apple.keynote":["key"],"application/vnd.apple.mpegurl":["m3u8"],"application/vnd.apple.numbers":["numbers"],"application/vnd.apple.pages":["pages"],"application/vnd.apple.pkpass":["pkpass"],"application/vnd.aristanetworks.swi":["swi"],"application/vnd.astraea-software.iota":["iota"],"application/vnd.audiograph":["aep"],"application/vnd.balsamiq.bmml+xml":["bmml"],"application/vnd.blueice.multipass":["mpm"],"application/vnd.bmi":["bmi"],"application/vnd.businessobjects":["rep"],"application/vnd.chemdraw+xml":["cdxml"],"application/vnd.chipnuts.karaoke-mmd":["mmd"],"application/vnd.cinderella":["cdy"],"application/vnd.citationstyles.style+xml":["csl"],"application/vnd.claymore":["cla"],"application/vnd.cloanto.rp9":["rp9"],"application/vnd.clonk.c4group":["c4g","c4d","c4f","c4p","c4u"],"application/vnd.cluetrust.cartomobile-config":["c11amc"],"application/vnd.cluetrust.cartomobile-config-pkg":["c11amz"],"application/vnd.commonspace":["csp"],"application/vnd.contact.cmsg":["cdbcmsg"],"application/vnd.cosmocaller":["cmc"],"application/vnd.crick.clicker":["clkx"],"application/vnd.crick.clicker.keyboard":["clkk"],"application/vnd.crick.clicker.palette":["clkp"],"application/vnd.crick.clicker.template":["clkt"],"application/vnd.crick.clicker.wordbank":["clkw"],"application/vnd.criticaltools.wbs+xml":["wbs"],"application/vnd.ctc-posml":["pml"],"application/vnd.cups-ppd":["ppd"],"application/vnd.curl.car":["car"],"application/vnd.curl.pcurl":["pcurl"],"application/vnd.dart":["dart"],"application/vnd.data-vision.rdz":["rdz"],"application/vnd.dbf":["dbf"],"application/vnd.dece.data":["uvf","uvvf","uvd","uvvd"],"application/vnd.dece.ttml+xml":["uvt","uvvt"],"application/vnd.dece.unspecified":["uvx","uvvx"],"application/vnd.dece.zip":["uvz","uvvz"],"application/vnd.denovo.fcselayout-link":["fe_launch"],"application/vnd.dna":["dna"],"application/vnd.dolby.mlp":["mlp"],"application/vnd.dpgraph":["dpg"],"application/vnd.dreamfactory":["dfac"],"application/vnd.ds-keypoint":["kpxx"],"application/vnd.dvb.ait":["ait"],"application/vnd.dvb.service":["svc"],"application/vnd.dynageo":["geo"],"application/vnd.ecowin.chart":["mag"],"application/vnd.enliven":["nml"],"application/vnd.epson.esf":["esf"],"application/vnd.epson.msf":["msf"],"application/vnd.epson.quickanime":["qam"],"application/vnd.epson.salt":["slt"],"application/vnd.epson.ssf":["ssf"],"application/vnd.eszigno3+xml":["es3","et3"],"application/vnd.ezpix-album":["ez2"],"application/vnd.ezpix-package":["ez3"],"application/vnd.fdf":["fdf"],"application/vnd.fdsn.mseed":["mseed"],"application/vnd.fdsn.seed":["seed","dataless"],"application/vnd.flographit":["gph"],"application/vnd.fluxtime.clip":["ftc"],"application/vnd.framemaker":["fm","frame","maker","book"],"application/vnd.frogans.fnc":["fnc"],"application/vnd.frogans.ltf":["ltf"],"application/vnd.fsc.weblaunch":["fsc"],"application/vnd.fujitsu.oasys":["oas"],"application/vnd.fujitsu.oasys2":["oa2"],"application/vnd.fujitsu.oasys3":["oa3"],"application/vnd.fujitsu.oasysgp":["fg5"],"application/vnd.fujitsu.oasysprs":["bh2"],"application/vnd.fujixerox.ddd":["ddd"],"application/vnd.fujixerox.docuworks":["xdw"],"application/vnd.fujixerox.docuworks.binder":["xbd"],"application/vnd.fuzzysheet":["fzs"],"application/vnd.genomatix.tuxedo":["txd"],"application/vnd.geogebra.file":["ggb"],"application/vnd.geogebra.tool":["ggt"],"application/vnd.geometry-explorer":["gex","gre"],"application/vnd.geonext":["gxt"],"application/vnd.geoplan":["g2w"],"application/vnd.geospace":["g3w"],"application/vnd.gmx":["gmx"],"application/vnd.google-apps.document":["gdoc"],"application/vnd.google-apps.presentation":["gslides"],"application/vnd.google-apps.spreadsheet":["gsheet"],"application/vnd.google-earth.kml+xml":["kml"],"application/vnd.google-earth.kmz":["kmz"],"application/vnd.grafeq":["gqf","gqs"],"application/vnd.groove-account":["gac"],"application/vnd.groove-help":["ghf"],"application/vnd.groove-identity-message":["gim"],"application/vnd.groove-injector":["grv"],"application/vnd.groove-tool-message":["gtm"],"application/vnd.groove-tool-template":["tpl"],"application/vnd.groove-vcard":["vcg"],"application/vnd.hal+xml":["hal"],"application/vnd.handheld-entertainment+xml":["zmm"],"application/vnd.hbci":["hbci"],"application/vnd.hhe.lesson-player":["les"],"application/vnd.hp-hpgl":["hpgl"],"application/vnd.hp-hpid":["hpid"],"application/vnd.hp-hps":["hps"],"application/vnd.hp-jlyt":["jlt"],"application/vnd.hp-pcl":["pcl"],"application/vnd.hp-pclxl":["pclxl"],"application/vnd.hydrostatix.sof-data":["sfd-hdstx"],"application/vnd.ibm.minipay":["mpy"],"application/vnd.ibm.modcap":["afp","listafp","list3820"],"application/vnd.ibm.rights-management":["irm"],"application/vnd.ibm.secure-container":["sc"],"application/vnd.iccprofile":["icc","icm"],"application/vnd.igloader":["igl"],"application/vnd.immervision-ivp":["ivp"],"application/vnd.immervision-ivu":["ivu"],"application/vnd.insors.igm":["igm"],"application/vnd.intercon.formnet":["xpw","xpx"],"application/vnd.intergeo":["i2g"],"application/vnd.intu.qbo":["qbo"],"application/vnd.intu.qfx":["qfx"],"application/vnd.ipunplugged.rcprofile":["rcprofile"],"application/vnd.irepository.package+xml":["irp"],"application/vnd.is-xpr":["xpr"],"application/vnd.isac.fcs":["fcs"],"application/vnd.jam":["jam"],"application/vnd.jcp.javame.midlet-rms":["rms"],"application/vnd.jisp":["jisp"],"application/vnd.joost.joda-archive":["joda"],"application/vnd.kahootz":["ktz","ktr"],"application/vnd.kde.karbon":["karbon"],"application/vnd.kde.kchart":["chrt"],"application/vnd.kde.kformula":["kfo"],"application/vnd.kde.kivio":["flw"],"application/vnd.kde.kontour":["kon"],"application/vnd.kde.kpresenter":["kpr","kpt"],"application/vnd.kde.kspread":["ksp"],"application/vnd.kde.kword":["kwd","kwt"],"application/vnd.kenameaapp":["htke"],"application/vnd.kidspiration":["kia"],"application/vnd.kinar":["kne","knp"],"application/vnd.koan":["skp","skd","skt","skm"],"application/vnd.kodak-descriptor":["sse"],"application/vnd.las.las+xml":["lasxml"],"application/vnd.llamagraphics.life-balance.desktop":["lbd"],"application/vnd.llamagraphics.life-balance.exchange+xml":["lbe"],"application/vnd.lotus-1-2-3":["123"],"application/vnd.lotus-approach":["apr"],"application/vnd.lotus-freelance":["pre"],"application/vnd.lotus-notes":["nsf"],"application/vnd.lotus-organizer":["org"],"application/vnd.lotus-screencam":["scm"],"application/vnd.lotus-wordpro":["lwp"],"application/vnd.macports.portpkg":["portpkg"],"application/vnd.mapbox-vector-tile":["mvt"],"application/vnd.mcd":["mcd"],"application/vnd.medcalcdata":["mc1"],"application/vnd.mediastation.cdkey":["cdkey"],"application/vnd.mfer":["mwf"],"application/vnd.mfmp":["mfm"],"application/vnd.micrografx.flo":["flo"],"application/vnd.micrografx.igx":["igx"],"application/vnd.mif":["mif"],"application/vnd.mobius.daf":["daf"],"application/vnd.mobius.dis":["dis"],"application/vnd.mobius.mbk":["mbk"],"application/vnd.mobius.mqy":["mqy"],"application/vnd.mobius.msl":["msl"],"application/vnd.mobius.plc":["plc"],"application/vnd.mobius.txf":["txf"],"application/vnd.mophun.application":["mpn"],"application/vnd.mophun.certificate":["mpc"],"application/vnd.mozilla.xul+xml":["xul"],"application/vnd.ms-artgalry":["cil"],"application/vnd.ms-cab-compressed":["cab"],"application/vnd.ms-excel":["xls","xlm","xla","xlc","xlt","xlw"],"application/vnd.ms-excel.addin.macroenabled.12":["xlam"],"application/vnd.ms-excel.sheet.binary.macroenabled.12":["xlsb"],"application/vnd.ms-excel.sheet.macroenabled.12":["xlsm"],"application/vnd.ms-excel.template.macroenabled.12":["xltm"],"application/vnd.ms-fontobject":["eot"],"application/vnd.ms-htmlhelp":["chm"],"application/vnd.ms-ims":["ims"],"application/vnd.ms-lrm":["lrm"],"application/vnd.ms-officetheme":["thmx"],"application/vnd.ms-outlook":["msg"],"application/vnd.ms-pki.seccat":["cat"],"application/vnd.ms-pki.stl":["stl"],"application/vnd.ms-powerpoint":["ppt","pps","pot"],"application/vnd.ms-powerpoint.addin.macroenabled.12":["ppam"],"application/vnd.ms-powerpoint.presentation.macroenabled.12":["pptm"],"application/vnd.ms-powerpoint.slide.macroenabled.12":["sldm"],"application/vnd.ms-powerpoint.slideshow.macroenabled.12":["ppsm"],"application/vnd.ms-powerpoint.template.macroenabled.12":["potm"],"application/vnd.ms-project":["mpp","mpt"],"application/vnd.ms-word.document.macroenabled.12":["docm"],"application/vnd.ms-word.template.macroenabled.12":["dotm"],"application/vnd.ms-works":["wps","wks","wcm","wdb"],"application/vnd.ms-wpl":["wpl"],"application/vnd.ms-xpsdocument":["xps"],"application/vnd.mseq":["mseq"],"application/vnd.musician":["mus"],"application/vnd.muvee.style":["msty"],"application/vnd.mynfc":["taglet"],"application/vnd.neurolanguage.nlu":["nlu"],"application/vnd.nitf":["ntf","nitf"],"application/vnd.noblenet-directory":["nnd"],"application/vnd.noblenet-sealer":["nns"],"application/vnd.noblenet-web":["nnw"],"application/vnd.nokia.n-gage.ac+xml":["ac"],"application/vnd.nokia.n-gage.data":["ngdat"],"application/vnd.nokia.n-gage.symbian.install":["n-gage"],"application/vnd.nokia.radio-preset":["rpst"],"application/vnd.nokia.radio-presets":["rpss"],"application/vnd.novadigm.edm":["edm"],"application/vnd.novadigm.edx":["edx"],"application/vnd.novadigm.ext":["ext"],"application/vnd.oasis.opendocument.chart":["odc"],"application/vnd.oasis.opendocument.chart-template":["otc"],"application/vnd.oasis.opendocument.database":["odb"],"application/vnd.oasis.opendocument.formula":["odf"],"application/vnd.oasis.opendocument.formula-template":["odft"],"application/vnd.oasis.opendocument.graphics":["odg"],"application/vnd.oasis.opendocument.graphics-template":["otg"],"application/vnd.oasis.opendocument.image":["odi"],"application/vnd.oasis.opendocument.image-template":["oti"],"application/vnd.oasis.opendocument.presentation":["odp"],"application/vnd.oasis.opendocument.presentation-template":["otp"],"application/vnd.oasis.opendocument.spreadsheet":["ods"],"application/vnd.oasis.opendocument.spreadsheet-template":["ots"],"application/vnd.oasis.opendocument.text":["odt"],"application/vnd.oasis.opendocument.text-master":["odm"],"application/vnd.oasis.opendocument.text-template":["ott"],"application/vnd.oasis.opendocument.text-web":["oth"],"application/vnd.olpc-sugar":["xo"],"application/vnd.oma.dd2+xml":["dd2"],"application/vnd.openblox.game+xml":["obgx"],"application/vnd.openofficeorg.extension":["oxt"],"application/vnd.openstreetmap.data+xml":["osm"],"application/vnd.openxmlformats-officedocument.presentationml.presentation":["pptx"],"application/vnd.openxmlformats-officedocument.presentationml.slide":["sldx"],"application/vnd.openxmlformats-officedocument.presentationml.slideshow":["ppsx"],"application/vnd.openxmlformats-officedocument.presentationml.template":["potx"],"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":["xlsx"],"application/vnd.openxmlformats-officedocument.spreadsheetml.template":["xltx"],"application/vnd.openxmlformats-officedocument.wordprocessingml.document":["docx"],"application/vnd.openxmlformats-officedocument.wordprocessingml.template":["dotx"],"application/vnd.osgeo.mapguide.package":["mgp"],"application/vnd.osgi.dp":["dp"],"application/vnd.osgi.subsystem":["esa"],"application/vnd.palm":["pdb","pqa","oprc"],"application/vnd.pawaafile":["paw"],"application/vnd.pg.format":["str"],"application/vnd.pg.osasli":["ei6"],"application/vnd.picsel":["efif"],"application/vnd.pmi.widget":["wg"],"application/vnd.pocketlearn":["plf"],"application/vnd.powerbuilder6":["pbd"],"application/vnd.previewsystems.box":["box"],"application/vnd.proteus.magazine":["mgz"],"application/vnd.publishare-delta-tree":["qps"],"application/vnd.pvi.ptid1":["ptid"],"application/vnd.pwg-xhtml-print+xml":["xhtm"],"application/vnd.quark.quarkxpress":["qxd","qxt","qwd","qwt","qxl","qxb"],"application/vnd.rar":["rar"],"application/vnd.realvnc.bed":["bed"],"application/vnd.recordare.musicxml":["mxl"],"application/vnd.recordare.musicxml+xml":["musicxml"],"application/vnd.rig.cryptonote":["cryptonote"],"application/vnd.rim.cod":["cod"],"application/vnd.rn-realmedia":["rm"],"application/vnd.rn-realmedia-vbr":["rmvb"],"application/vnd.route66.link66+xml":["link66"],"application/vnd.sailingtracker.track":["st"],"application/vnd.seemail":["see"],"application/vnd.sema":["sema"],"application/vnd.semd":["semd"],"application/vnd.semf":["semf"],"application/vnd.shana.informed.formdata":["ifm"],"application/vnd.shana.informed.formtemplate":["itp"],"application/vnd.shana.informed.interchange":["iif"],"application/vnd.shana.informed.package":["ipk"],"application/vnd.simtech-mindmapper":["twd","twds"],"application/vnd.smaf":["mmf"],"application/vnd.smart.teacher":["teacher"],"application/vnd.software602.filler.form+xml":["fo"],"application/vnd.solent.sdkm+xml":["sdkm","sdkd"],"application/vnd.spotfire.dxp":["dxp"],"application/vnd.spotfire.sfs":["sfs"],"application/vnd.stardivision.calc":["sdc"],"application/vnd.stardivision.draw":["sda"],"application/vnd.stardivision.impress":["sdd"],"application/vnd.stardivision.math":["smf"],"application/vnd.stardivision.writer":["sdw","vor"],"application/vnd.stardivision.writer-global":["sgl"],"application/vnd.stepmania.package":["smzip"],"application/vnd.stepmania.stepchart":["sm"],"application/vnd.sun.wadl+xml":["wadl"],"application/vnd.sun.xml.calc":["sxc"],"application/vnd.sun.xml.calc.template":["stc"],"application/vnd.sun.xml.draw":["sxd"],"application/vnd.sun.xml.draw.template":["std"],"application/vnd.sun.xml.impress":["sxi"],"application/vnd.sun.xml.impress.template":["sti"],"application/vnd.sun.xml.math":["sxm"],"application/vnd.sun.xml.writer":["sxw"],"application/vnd.sun.xml.writer.global":["sxg"],"application/vnd.sun.xml.writer.template":["stw"],"application/vnd.sus-calendar":["sus","susp"],"application/vnd.svd":["svd"],"application/vnd.symbian.install":["sis","sisx"],"application/vnd.syncml+xml":["xsm"],"application/vnd.syncml.dm+wbxml":["bdm"],"application/vnd.syncml.dm+xml":["xdm"],"application/vnd.syncml.dmddf+xml":["ddf"],"application/vnd.tao.intent-module-archive":["tao"],"application/vnd.tcpdump.pcap":["pcap","cap","dmp"],"application/vnd.tmobile-livetv":["tmo"],"application/vnd.trid.tpt":["tpt"],"application/vnd.triscape.mxs":["mxs"],"application/vnd.trueapp":["tra"],"application/vnd.ufdl":["ufd","ufdl"],"application/vnd.uiq.theme":["utz"],"application/vnd.umajin":["umj"],"application/vnd.unity":["unityweb"],"application/vnd.uoml+xml":["uoml","uo"],"application/vnd.vcx":["vcx"],"application/vnd.visio":["vsd","vst","vss","vsw"],"application/vnd.visionary":["vis"],"application/vnd.vsf":["vsf"],"application/vnd.wap.wbxml":["wbxml"],"application/vnd.wap.wmlc":["wmlc"],"application/vnd.wap.wmlscriptc":["wmlsc"],"application/vnd.webturbo":["wtb"],"application/vnd.wolfram.player":["nbp"],"application/vnd.wordperfect":["wpd"],"application/vnd.wqd":["wqd"],"application/vnd.wt.stf":["stf"],"application/vnd.xara":["xar"],"application/vnd.xfdl":["xfdl"],"application/vnd.yamaha.hv-dic":["hvd"],"application/vnd.yamaha.hv-script":["hvs"],"application/vnd.yamaha.hv-voice":["hvp"],"application/vnd.yamaha.openscoreformat":["osf"],"application/vnd.yamaha.openscoreformat.osfpvg+xml":["osfpvg"],"application/vnd.yamaha.smaf-audio":["saf"],"application/vnd.yamaha.smaf-phrase":["spf"],"application/vnd.yellowriver-custom-menu":["cmp"],"application/vnd.zul":["zir","zirz"],"application/vnd.zzazz.deck+xml":["zaz"],"application/voicexml+xml":["vxml"],"application/wasm":["wasm"],"application/watcherinfo+xml":["wif"],"application/widget":["wgt"],"application/winhlp":["hlp"],"application/wsdl+xml":["wsdl"],"application/wspolicy+xml":["wspolicy"],"application/x-7z-compressed":["7z"],"application/x-abiword":["abw"],"application/x-ace-compressed":["ace"],"application/x-apple-diskimage":["dmg"],"application/x-arj":["arj"],"application/x-authorware-bin":["aab","x32","u32","vox"],"application/x-authorware-map":["aam"],"application/x-authorware-seg":["aas"],"application/x-bcpio":["bcpio"],"application/x-bdoc":["bdoc"],"application/x-bittorrent":["torrent"],"application/x-blorb":["blb","blorb"],"application/x-bzip":["bz"],"application/x-bzip2":["bz2","boz"],"application/x-cbr":["cbr","cba","cbt","cbz","cb7"],"application/x-cdlink":["vcd"],"application/x-cfs-compressed":["cfs"],"application/x-chat":["chat"],"application/x-chess-pgn":["pgn"],"application/x-chrome-extension":["crx"],"application/x-cocoa":["cco"],"application/x-conference":["nsc"],"application/x-cpio":["cpio"],"application/x-csh":["csh"],"application/x-debian-package":["deb","udeb"],"application/x-dgc-compressed":["dgc"],"application/x-director":["dir","dcr","dxr","cst","cct","cxt","w3d","fgd","swa"],"application/x-doom":["wad"],"application/x-dtbncx+xml":["ncx"],"application/x-dtbook+xml":["dtb"],"application/x-dtbresource+xml":["res"],"application/x-dvi":["dvi"],"application/x-envoy":["evy"],"application/x-eva":["eva"],"application/x-font-bdf":["bdf"],"application/x-font-ghostscript":["gsf"],"application/x-font-linux-psf":["psf"],"application/x-font-pcf":["pcf"],"application/x-font-snf":["snf"],"application/x-font-type1":["pfa","pfb","pfm","afm"],"application/x-freearc":["arc"],"application/x-futuresplash":["spl"],"application/x-gca-compressed":["gca"],"application/x-glulx":["ulx"],"application/x-gnumeric":["gnumeric"],"application/x-gramps-xml":["gramps"],"application/x-gtar":["gtar"],"application/x-hdf":["hdf"],"application/x-httpd-php":["php"],"application/x-install-instructions":["install"],"application/x-iso9660-image":["iso"],"application/x-iwork-keynote-sffkey":["key"],"application/x-iwork-numbers-sffnumbers":["numbers"],"application/x-iwork-pages-sffpages":["pages"],"application/x-java-archive-diff":["jardiff"],"application/x-java-jnlp-file":["jnlp"],"application/x-keepass2":["kdbx"],"application/x-latex":["latex"],"application/x-lua-bytecode":["luac"],"application/x-lzh-compressed":["lzh","lha"],"application/x-makeself":["run"],"application/x-mie":["mie"],"application/x-mobipocket-ebook":["prc","mobi"],"application/x-ms-application":["application"],"application/x-ms-shortcut":["lnk"],"application/x-ms-wmd":["wmd"],"application/x-ms-wmz":["wmz"],"application/x-ms-xbap":["xbap"],"application/x-msaccess":["mdb"],"application/x-msbinder":["obd"],"application/x-mscardfile":["crd"],"application/x-msclip":["clp"],"application/x-msdos-program":["exe"],"application/x-msdownload":["exe","dll","com","bat","msi"],"application/x-msmediaview":["mvb","m13","m14"],"application/x-msmetafile":["wmf","wmz","emf","emz"],"application/x-msmoney":["mny"],"application/x-mspublisher":["pub"],"application/x-msschedule":["scd"],"application/x-msterminal":["trm"],"application/x-mswrite":["wri"],"application/x-netcdf":["nc","cdf"],"application/x-ns-proxy-autoconfig":["pac"],"application/x-nzb":["nzb"],"application/x-perl":["pl","pm"],"application/x-pilot":["prc","pdb"],"application/x-pkcs12":["p12","pfx"],"application/x-pkcs7-certificates":["p7b","spc"],"application/x-pkcs7-certreqresp":["p7r"],"application/x-rar-compressed":["rar"],"application/x-redhat-package-manager":["rpm"],"application/x-research-info-systems":["ris"],"application/x-sea":["sea"],"application/x-sh":["sh"],"application/x-shar":["shar"],"application/x-shockwave-flash":["swf"],"application/x-silverlight-app":["xap"],"application/x-sql":["sql"],"application/x-stuffit":["sit"],"application/x-stuffitx":["sitx"],"application/x-subrip":["srt"],"application/x-sv4cpio":["sv4cpio"],"application/x-sv4crc":["sv4crc"],"application/x-t3vm-image":["t3"],"application/x-tads":["gam"],"application/x-tar":["tar"],"application/x-tcl":["tcl","tk"],"application/x-tex":["tex"],"application/x-tex-tfm":["tfm"],"application/x-texinfo":["texinfo","texi"],"application/x-tgif":["obj"],"application/x-ustar":["ustar"],"application/x-virtualbox-hdd":["hdd"],"application/x-virtualbox-ova":["ova"],"application/x-virtualbox-ovf":["ovf"],"application/x-virtualbox-vbox":["vbox"],"application/x-virtualbox-vbox-extpack":["vbox-extpack"],"application/x-virtualbox-vdi":["vdi"],"application/x-virtualbox-vhd":["vhd"],"application/x-virtualbox-vmdk":["vmdk"],"application/x-wais-source":["src"],"application/x-web-app-manifest+json":["webapp"],"application/x-x509-ca-cert":["der","crt","pem"],"application/x-xfig":["fig"],"application/x-xliff+xml":["xlf"],"application/x-xpinstall":["xpi"],"application/x-xz":["xz"],"application/x-zmachine":["z1","z2","z3","z4","z5","z6","z7","z8"],"application/xaml+xml":["xaml"],"application/xcap-att+xml":["xav"],"application/xcap-caps+xml":["xca"],"application/xcap-diff+xml":["xdf"],"application/xcap-el+xml":["xel"],"application/xcap-ns+xml":["xns"],"application/xenc+xml":["xenc"],"application/xfdf":["xfdf"],"application/xhtml+xml":["xhtml","xht"],"application/xliff+xml":["xlf"],"application/xml":["xml","xsl","xsd","rng"],"application/xml-dtd":["dtd"],"application/xop+xml":["xop"],"application/xproc+xml":["xpl"],"application/xslt+xml":["xsl","xslt"],"application/xspf+xml":["xspf"],"application/xv+xml":["mxml","xhvml","xvml","xvm"],"application/yang":["yang"],"application/yin+xml":["yin"],"application/zip":["zip"],"audio/3gpp":["3gpp"],"audio/aac":["adts","aac"],"audio/adpcm":["adp"],"audio/amr":["amr"],"audio/basic":["au","snd"],"audio/midi":["mid","midi","kar","rmi"],"audio/mobile-xmf":["mxmf"],"audio/mp3":["mp3"],"audio/mp4":["m4a","mp4a"],"audio/mpeg":["mpga","mp2","mp2a","mp3","m2a","m3a"],"audio/ogg":["oga","ogg","spx","opus"],"audio/s3m":["s3m"],"audio/silk":["sil"],"audio/vnd.dece.audio":["uva","uvva"],"audio/vnd.digital-winds":["eol"],"audio/vnd.dra":["dra"],"audio/vnd.dts":["dts"],"audio/vnd.dts.hd":["dtshd"],"audio/vnd.lucent.voice":["lvp"],"audio/vnd.ms-playready.media.pya":["pya"],"audio/vnd.nuera.ecelp4800":["ecelp4800"],"audio/vnd.nuera.ecelp7470":["ecelp7470"],"audio/vnd.nuera.ecelp9600":["ecelp9600"],"audio/vnd.rip":["rip"],"audio/wav":["wav"],"audio/wave":["wav"],"audio/webm":["weba"],"audio/x-aac":["aac"],"audio/x-aiff":["aif","aiff","aifc"],"audio/x-caf":["caf"],"audio/x-flac":["flac"],"audio/x-m4a":["m4a"],"audio/x-matroska":["mka"],"audio/x-mpegurl":["m3u"],"audio/x-ms-wax":["wax"],"audio/x-ms-wma":["wma"],"audio/x-pn-realaudio":["ram","ra"],"audio/x-pn-realaudio-plugin":["rmp"],"audio/x-realaudio":["ra"],"audio/x-wav":["wav"],"audio/xm":["xm"],"chemical/x-cdx":["cdx"],"chemical/x-cif":["cif"],"chemical/x-cmdf":["cmdf"],"chemical/x-cml":["cml"],"chemical/x-csml":["csml"],"chemical/x-xyz":["xyz"],"font/collection":["ttc"],"font/otf":["otf"],"font/ttf":["ttf"],"font/woff":["woff"],"font/woff2":["woff2"],"image/aces":["exr"],"image/apng":["apng"],"image/avci":["avci"],"image/avcs":["avcs"],"image/avif":["avif"],"image/bmp":["bmp","dib"],"image/cgm":["cgm"],"image/dicom-rle":["drle"],"image/emf":["emf"],"image/fits":["fits"],"image/g3fax":["g3"],"image/gif":["gif"],"image/heic":["heic"],"image/heic-sequence":["heics"],"image/heif":["heif"],"image/heif-sequence":["heifs"],"image/hej2k":["hej2"],"image/hsj2":["hsj2"],"image/ief":["ief"],"image/jls":["jls"],"image/jp2":["jp2","jpg2"],"image/jpeg":["jpeg","jpg","jpe"],"image/jph":["jph"],"image/jphc":["jhc"],"image/jpm":["jpm"],"image/jpx":["jpx","jpf"],"image/jxr":["jxr"],"image/jxra":["jxra"],"image/jxrs":["jxrs"],"image/jxs":["jxs"],"image/jxsc":["jxsc"],"image/jxsi":["jxsi"],"image/jxss":["jxss"],"image/ktx":["ktx"],"image/ktx2":["ktx2"],"image/png":["png"],"image/prs.btif":["btif","btf"],"image/prs.pti":["pti"],"image/sgi":["sgi"],"image/svg+xml":["svg","svgz"],"image/t38":["t38"],"image/tiff":["tif","tiff"],"image/tiff-fx":["tfx"],"image/vnd.adobe.photoshop":["psd"],"image/vnd.airzip.accelerator.azv":["azv"],"image/vnd.dece.graphic":["uvi","uvvi","uvg","uvvg"],"image/vnd.djvu":["djvu","djv"],"image/vnd.dvb.subtitle":["sub"],"image/vnd.dwg":["dwg"],"image/vnd.dxf":["dxf"],"image/vnd.fastbidsheet":["fbs"],"image/vnd.fpx":["fpx"],"image/vnd.fst":["fst"],"image/vnd.fujixerox.edmics-mmr":["mmr"],"image/vnd.fujixerox.edmics-rlc":["rlc"],"image/vnd.microsoft.icon":["ico"],"image/vnd.mozilla.apng":["apng"],"image/vnd.ms-dds":["dds"],"image/vnd.ms-modi":["mdi"],"image/vnd.ms-photo":["wdp"],"image/vnd.net-fpx":["npx"],"image/vnd.pco.b16":["b16"],"image/vnd.tencent.tap":["tap"],"image/vnd.valve.source.texture":["vtf"],"image/vnd.wap.wbmp":["wbmp"],"image/vnd.xiff":["xif"],"image/vnd.zbrush.pcx":["pcx"],"image/webp":["webp"],"image/wmf":["wmf"],"image/x-3ds":["3ds"],"image/x-cmu-raster":["ras"],"image/x-cmx":["cmx"],"image/x-freehand":["fh","fhc","fh4","fh5","fh7"],"image/x-icon":["ico"],"image/x-jng":["jng"],"image/x-mrsid-image":["sid"],"image/x-ms-bmp":["bmp"],"image/x-pcx":["pcx"],"image/x-pict":["pic","pct"],"image/x-portable-anymap":["pnm"],"image/x-portable-bitmap":["pbm"],"image/x-portable-graymap":["pgm"],"image/x-portable-pixmap":["ppm"],"image/x-rgb":["rgb"],"image/x-tga":["tga"],"image/x-xbitmap":["xbm"],"image/x-xpixmap":["xpm"],"image/x-xwindowdump":["xwd"],"message/disposition-notification":["disposition-notification"],"message/global":["u8msg"],"message/global-delivery-status":["u8dsn"],"message/global-disposition-notification":["u8mdn"],"message/global-headers":["u8hdr"],"message/rfc822":["eml","mime"],"message/vnd.wfa.wsc":["wsc"],"model/3mf":["3mf"],"model/gltf+json":["gltf"],"model/gltf-binary":["glb"],"model/iges":["igs","iges"],"model/mesh":["msh","mesh","silo"],"model/mtl":["mtl"],"model/obj":["obj"],"model/prc":["prc"],"model/step+xml":["stpx"],"model/step+zip":["stpz"],"model/step-xml+zip":["stpxz"],"model/stl":["stl"],"model/u3d":["u3d"],"model/vnd.collada+xml":["dae"],"model/vnd.dwf":["dwf"],"model/vnd.gdl":["gdl"],"model/vnd.gtw":["gtw"],"model/vnd.mts":["mts"],"model/vnd.opengex":["ogex"],"model/vnd.parasolid.transmit.binary":["x_b"],"model/vnd.parasolid.transmit.text":["x_t"],"model/vnd.pytha.pyox":["pyo","pyox"],"model/vnd.sap.vds":["vds"],"model/vnd.usdz+zip":["usdz"],"model/vnd.valve.source.compiled-map":["bsp"],"model/vnd.vtu":["vtu"],"model/vrml":["wrl","vrml"],"model/x3d+binary":["x3db","x3dbz"],"model/x3d+fastinfoset":["x3db"],"model/x3d+vrml":["x3dv","x3dvz"],"model/x3d+xml":["x3d","x3dz"],"model/x3d-vrml":["x3dv"],"text/cache-manifest":["appcache","manifest"],"text/calendar":["ics","ifb"],"text/coffeescript":["coffee","litcoffee"],"text/css":["css"],"text/csv":["csv"],"text/html":["html","htm","shtml"],"text/jade":["jade"],"text/javascript":["js","mjs"],"text/jsx":["jsx"],"text/less":["less"],"text/markdown":["md","markdown"],"text/mathml":["mml"],"text/mdx":["mdx"],"text/n3":["n3"],"text/plain":["txt","text","conf","def","list","log","in","ini"],"text/prs.lines.tag":["dsc"],"text/richtext":["rtx"],"text/rtf":["rtf"],"text/sgml":["sgml","sgm"],"text/shex":["shex"],"text/slim":["slim","slm"],"text/spdx":["spdx"],"text/stylus":["stylus","styl"],"text/tab-separated-values":["tsv"],"text/troff":["t","tr","roff","man","me","ms"],"text/turtle":["ttl"],"text/uri-list":["uri","uris","urls"],"text/vcard":["vcard"],"text/vnd.curl":["curl"],"text/vnd.curl.dcurl":["dcurl"],"text/vnd.curl.mcurl":["mcurl"],"text/vnd.curl.scurl":["scurl"],"text/vnd.dvb.subtitle":["sub"],"text/vnd.familysearch.gedcom":["ged"],"text/vnd.fly":["fly"],"text/vnd.fmi.flexstor":["flx"],"text/vnd.graphviz":["gv"],"text/vnd.in3d.3dml":["3dml"],"text/vnd.in3d.spot":["spot"],"text/vnd.sun.j2me.app-descriptor":["jad"],"text/vnd.wap.wml":["wml"],"text/vnd.wap.wmlscript":["wmls"],"text/vtt":["vtt"],"text/x-asm":["s","asm"],"text/x-c":["c","cc","cxx","cpp","h","hh","dic"],"text/x-component":["htc"],"text/x-fortran":["f","for","f77","f90"],"text/x-handlebars-template":["hbs"],"text/x-java-source":["java"],"text/x-lua":["lua"],"text/x-markdown":["mkd"],"text/x-nfo":["nfo"],"text/x-opml":["opml"],"text/x-org":["org"],"text/x-pascal":["p","pas"],"text/x-processing":["pde"],"text/x-sass":["sass"],"text/x-scss":["scss"],"text/x-setext":["etx"],"text/x-sfv":["sfv"],"text/x-suse-ymp":["ymp"],"text/x-uuencode":["uu"],"text/x-vcalendar":["vcs"],"text/x-vcard":["vcf"],"text/xml":["xml"],"text/yaml":["yaml","yml"],"video/3gpp":["3gp","3gpp"],"video/3gpp2":["3g2"],"video/h261":["h261"],"video/h263":["h263"],"video/h264":["h264"],"video/iso.segment":["m4s"],"video/jpeg":["jpgv"],"video/jpm":["jpm","jpgm"],"video/mj2":["mj2","mjp2"],"video/mp2t":["ts"],"video/mp4":["mp4","mp4v","mpg4"],"video/mpeg":["mpeg","mpg","mpe","m1v","m2v"],"video/ogg":["ogv"],"video/quicktime":["qt","mov"],"video/vnd.dece.hd":["uvh","uvvh"],"video/vnd.dece.mobile":["uvm","uvvm"],"video/vnd.dece.pd":["uvp","uvvp"],"video/vnd.dece.sd":["uvs","uvvs"],"video/vnd.dece.video":["uvv","uvvv"],"video/vnd.dvb.file":["dvb"],"video/vnd.fvt":["fvt"],"video/vnd.mpegurl":["mxu","m4u"],"video/vnd.ms-playready.media.pyv":["pyv"],"video/vnd.uvvu.mp4":["uvu","uvvu"],"video/vnd.vivo":["viv"],"video/webm":["webm"],"video/x-f4v":["f4v"],"video/x-fli":["fli"],"video/x-flv":["flv"],"video/x-m4v":["m4v"],"video/x-matroska":["mkv","mk3d","mks"],"video/x-mng":["mng"],"video/x-ms-asf":["asf","asx"],"video/x-ms-vob":["vob"],"video/x-ms-wm":["wm"],"video/x-ms-wmv":["wmv"],"video/x-ms-wmx":["wmx"],"video/x-ms-wvx":["wvx"],"video/x-msvideo":["avi"],"video/x-sgi-movie":["movie"],"video/x-smv":["smv"],"x-conference/x-cooltalk":["ice"]
    };

    //node library test
    let fs;
    try {
        fs = require("node:fs/promises");
    } catch (e) {};

    const C3 = self.C3;
    const DOM_COMPONENT_ID = "RobotKaposzta_FileManager";

    /**
     * @external SDKInstanceBase
     * @desc The SDKInstanceBase interface is used as the base class for runtime instances in the SDK. For "world" type plugins, instances instead derive from SDKWorldInstanceBase which itself derives from SDKInstanceBase.
     * @see https://www.construct.net/en/make-games/manuals/addon-sdk/runtime-reference/base-classes/sdkinstancebase
     */
    /**
     * @classdesc FileManager editor class.
     * @extends external:SDKInstanceBase
     */
    class FileManagerRuntimeInstance extends C3.SDKInstanceBase {
        constructor(inst, properties) {
            super(inst, DOM_COMPONENT_ID);

            this._support = {
                "isNWJS": false,
                "isElectron": false,
                "isCordova": false,
                "isFileAccess": false
            };

            this._virtualQuota = 10;
            this._virtualStorage = new Map();

            this._dragX = 0;
            this._dragY = 0;
            this._dropRW = false;
            this._isDropEnable = false;
            this._dialogRW = false;

            this._paths = [];
            this._types = [];
            this._sizes = [];
            this._modifies = [];

            this._readData = "";
            this._freeSpace = 0;

            this._curTag = "";
            this._curProgress = 0;
            this._curStatus = 0;
            this._curType = 0;
            this._curError = 0;

            this._processStatus = new Map();

            this.AddDOMMessageHandlers([
                ["on-drag-start", (e) => this._OnDragStart(e)],
                ["on-drag", (e) => this._OnDrag(e)],
                ["on-drag-end", (e) => this._OnDragEnd(e)],
                ["on-drop",(e) => this._OnDrop(e)]
            ]);
            
            this._runtime.AddLoadPromise((async () => {
                await this._SetEnviroment();

                if (properties) {
                    //drop mode
                    this._SetDropMode(!!properties[0]);
                    //drop enable
                    this._SetDropEnable(properties[1]);
                    //dialog mode
                    this._SetDialogMode(!!properties[2]);
                }
            })());
        }
        SaveToJson() {
            return [
                this._dropMode,
                this._isDropEnable,
                this._dialogMode
            ];
        }
        LoadFromJson(o) {
            this._SetDropMode(o[0]);
            this._SetDropEnable(o[1]);
            this._SetDialogMode(o[2]);
        }
        GetDebuggerProperties() {
            const prefix = "plugins.robotkaposzta_filemanager.debugger.dialog-and-drop";
            const prefix2 = "plugins.robotkaposzta_filemanager.debugger.enviroment";
            return [
                {
                    "title": prefix + ".name",
                    "properties": [
                        {
                            "name": prefix + ".write-support",
                            "value": this._support["isNWJS"] || this._support["isElectron"] || this._support["isFileAccess"]
                        },
                        {
                            "name": prefix + ".drop-mode",
                            "value": this._dropRW,
                            "onedit": v => this._SetDropMode(v)
                        },
                        {
                            "name": prefix + ".drop-enable",
                            "value": this._isDropEnable,
                            "onedit": v => this._SetDropEnable(v)
                        },
                        {
                            "name": prefix + ".drag-x",
                            "value": this._CssToLayer(this._dragX, this._dragY, 0)[0]
                        },
                        {
                            "name": prefix + ".drag-y",
                            "value": this._CssToLayer(this._dragX, this._dragY, 0)[1]
                        },
                        {
                            "name": prefix + ".dialog-mode",
                            "value": this._dialogRW,
                            "onedit": v => this._SetDialogMode(v)
                        }
                    ]
                },
                {
                    "title": prefix2 + ".name",
                    "properties": [
                        {
                            "name": prefix2 + ".self",
                            "value": this._Directory("self")
                        },
                        {
                            "name": prefix2 + ".home",
                            "value": this._Directory("home")
                        },
                        {
                            "name": prefix2 + ".temp",
                            "value": this._Directory("temp")
                        },
                        {
                            "name": prefix2 + ".appid",
                            "value": this._Directory("appid")
                        },
                        {
                            "name": prefix2 + ".sdcardid",
                            "value": this._Directory("sdcardid")
                        }
                    ]
                }
            ];
        }
        _CssToLayer(x, y, at) {
            const layout = this._runtime.GetMainRunningLayout();
            at = parseInt(at);
            if (isNaN(at) || at >= layout.GetLayerCount()) {
                at = 0;
            }
            const layer = layout.GetLayerByIndex(at);
            return layer.CanvasCssToLayer(x, y);
        }
        _AcceptParse(str, toSingle=false) {
            let result = [];
            const resultDoubleComma = [];
            //double comma split
            const regex = new RegExp(/(\\,)|(,,)/, "g");
            let array;
            let startIndex = 0;
            while ((array = regex.exec(str)) !== null) {
                if (typeof array[2] !== "undefined") {
                    const s = str.substring(startIndex, array.index);
                    startIndex = array.index + 2;
                    resultDoubleComma.push(s);
                }
            }
            const s = str.substring(startIndex);
            resultDoubleComma.push(s);

            //parse sections
            let i = 1;
            const length = resultDoubleComma.length;
            if (toSingle) {
                //parse single sections
                if (length === 1) {
                    result = str;
                } else {
                    while (i < length) {
                        result.push(resultDoubleComma[i]);
                        i += 2; 
                    }
                    result = result.join(",");
                }
            } else {
                //parse file access sections
                if (length === 1) {
                    i = 0;
                }
                while (i < length) {
                	const accept = [];
                	const exts = new Set(resultDoubleComma[i].split(","));
                    const extsIt = exts.entries();
                    for (let ext of extsIt) {
                    	ext = ext[0];
                        if (ext === "") {
                            continue;
                        }
                        if (ext.indexOf("/") === -1) {
                        	accept.push(ext);
                    		continue;
                    	}
                        const mime = ext.split("/");
                        if (mime[1] !== "*") {
                            if (typeof typeDB[ext] === "undefined") {
                                continue;
                            }
                            const exts = typeDB[ext];
                            for (const ext of exts) {
                                accept.push("." + ext);
                            }
                            continue;
                        }
                        for (const key in typeDB) {
                            if (key.startsWith(mime[0]) === false) {
                                continue;
                            }
                            const exts = typeDB[key];
                            for (const ext of exts) {
                                accept.push("." + ext);
                            }
                        }
                    }
                    if (accept.length !== 0) {
                        result.push({
                            "description": resultDoubleComma[i-1],
                            "accept": {"placeholder/placeholder": accept}
                        });
                    }
                    i += 2; 
                }
            }
            
            return result;
        }
        async _SetEnviroment() {
            //get data
            this._support = await this.PostToDOMAsync("get-platform");
            this._virtualStorage = await this.PostToDOMAsync("load-virtual-path");
            //set enviroment
            if (this._support["isNWJS"] || this._support["isElectron"]) {
                this._Directory = (type) => {
                    if (type === "self") {
                        return self["__dirname"];
                    } else if (type === "home") {
                        return require("os")["homedir"]();
                    } else if (type === "temp") {
                        return require("os")["tmpdir"]();
                    } else if (type === "appid") {
                        return "";
                    } else if (type === "sdcardid") {
                        return "";
                    }
                };
            } else if (this._support["isCordova"]) {

            }
        }


        _VirtualClean() {
            let tempCount = 0;
            const iterator = this._virtualStorage.entries();
            for (const item of iterator) {
                if (item[1] === 0) {
                    tempCount++;
                }
            }
            if (tempCount > this._virtualQuota) {
                const iterator = this._virtualStorage.entries();
                for (const item of iterator) {
                    if (item[1] === 0) {
                        this.PostToDOM("set-virtual-path", [item[0], 0]);
                        this._virtualStorage.delete(item[0]);
                    }
                }
            }
        }


        _SetDropMode(isWrite) {
            if (this._dropRW === isWrite) {
                return;
            }
            if (this._support["isNWJS"] || this._support["isElectron"]) {
                this._dropRW = isWrite;
                this.PostToDOM("set-drop-handle", [2]);
            } else if (isWrite === true && this._support["isFileAccess"]) {
                this._dropRW = isWrite;
                this.PostToDOM("set-drop-handle", [1]);
            } else {
                this._dropRW = false;
                this.PostToDOM("set-drop-handle", [0]);
            }
        }
        _SetDropEnable(isEnable) {
            this._isDropEnable = isEnable;
            this.PostToDOM("enable-drop", [isEnable]);
        }
        _OnDragStart(e) {
            this._dragX = e[0];
            this._dragY = e[1];
            this.Trigger(C3.Plugins.RobotKaposzta_FileManager.Cnds.OnDragStart);
        }
        _OnDrag(e) {
            this._dragX = e[0];
            this._dragY = e[1];
            this.Trigger(C3.Plugins.RobotKaposzta_FileManager.Cnds.OnDrag);
        }
        _OnDragEnd(e) {
            this._dragX = e[0];
            this._dragY = e[1];
            this.Trigger(C3.Plugins.RobotKaposzta_FileManager.Cnds.OnDragEnd);
        }
        _OnDrop(e) {
            this._dragX = e[0];
            this._dragY = e[1];

            this._paths = e[2][0];
            this._types = e[2][1];
            this._sizes = e[2][2];
            this._modifies = e[2][3];
            
            this._VirtualClean();
            for (const path of this._paths) {
                if (path.split("/")[1] === "virtual:") {
                    this._virtualStorage.set(path.split("/")[2], 0);
                }
            }
            this.Trigger(C3.Plugins.RobotKaposzta_FileManager.Cnds.OnDrop);
        }
        _SetDialogMode(isWrite) {
            if (this._dialogRW === isWrite) {
                return;
            }
            if (this._support["isElectron"]) {
                this._dialogRW = isWrite;
                this.PostToDOM("set-dialog-handle", [3]);
            } else if (this._support["isNWJS"]) {
                this._dialogRW = isWrite;
                this.PostToDOM("set-dialog-handle", [2]);
            } else if (isWrite === true && this._support["isFileAccess"]) {
                this._dialogRW = isWrite;
                this.PostToDOM("set-dialog-handle", [1]);
            } else {
                this._dialogRW = false;
                this.PostToDOM("set-dialog-handle", [0]);
            }
        }
        async _OpenDialog(type, accept, suggest) {
            if (this._dialogRW) {
                accept = this._AcceptParse(accept, false);
            } else {
                accept = this._AcceptParse(accept, true);
            }
            
            const result = await this.PostToDOMAsync("open-dialog", [type, accept, suggest]); //file, multiple, folder, save
            this._paths = result[0];
            this._types = result[1];
            this._sizes = result[2];
            this._modifies = result[3];
            if (this._paths.length === 0) {
                return false;
            }

            this._VirtualClean();
            for (const path of this._paths) {
                if (path.split("/")[1] === "virtual:") {
                    this._virtualStorage.set(path.split("/")[2], 0);
                }
            }
            
            return true;
        }

        
        _SetupProgress(tag) {
            //generate ID
            let newId = 0;
            while (typeof this._processStatus.get(String(newId)) !== "undefined") {
                newId++;
            }
            newId = String(newId);
            this._processStatus.set(newId, {
                tag: tag,
                isPause: false,
                isAbort: false
            });
            return newId;
        } 
        _SetProcess(tag, type) {
            if (type === 0) {
                const it = this._processStatus.entries();
                for (let val of it) {
                    if (val[1].tag === tag) {
                        val[1].isPause = true;
                        this._processStatus.set(val[0], val[1]);
                    }
                }
            } else if (type === 1) {
                const it = this._processStatus.entries();
                for (let val of it) {
                    if (val[1].tag === tag) {
                        val[1].isPause = false;
                        this._processStatus.set(val[0], val[1]);
                    }
                }
            } else {
                const it = this._processStatus.entries();
                for (let val of it) {
                    if (val[1].tag === tag) {
                        val[1].isAbort = true;
                        this._processStatus.set(val[0], val[1]);
                    }
                }
            }
            return;
        }
        async _hasAbort(processId) {
            return new Promise((resolve) => {
                //console.log("start")
                const val = this._processStatus.get(processId);
                if (!val) {
                    resolve(true);
                } else if (val.isAbort) {
                    this._processStatus.delete(processId);
                    resolve(true);
                } else if (!val.isPause) {
                    resolve(false);
                } else {
                    const i = setInterval(function() {
                        //console.log("a")
                        const val = this._processStatus.get(processId);
                        if (!val) {
                            resolve(true);
                        } else if (val.isAbort) {
                            console.log("i" + i);
                            clearInterval(i);
                            this._processStatus.delete(processId);
                            resolve(true);
                        } else if (!val.isPause) {
                            resolve(false);
                        }
                        //console.log("b")
                    }, 1000);
                }
            });
        }

        
        _IsAbsolute(path) {
            return pathLib.isAbsolute(path);
        }
        _Join() {
            return pathLib.join(...arguments);
        }
        _Normalize(path) {
            return pathLib.normalize(path);
        }
        _Dirname(path) {
            return pathLib.dirname(path);
        }
        _Filename(path) {
            const ext = pathLib.extname(path);
            return pathLib.basename(path, ext);
        }
        _Extname(path) {
            return pathLib.extname(path);
        }
        _MIMETypes(ext) {
            let finds = [];
            let check;
            for (const t in typeDB) {
                check = typeDB[t].find((v) => {
                    return v === ext || "." + v === ext;
                });
                if (check !== undefined) {
                    finds.push(t);
                }
            }
            return finds.join(",");
        }
        _MIMEExtensions(mime) {
            if (typeof typeDB[mime] !== "undefined") {
                return typeDB[mime].join(",");
            }
            return "";
        }
        _Directory(type) {
            if (type === "self") {
                return "/virtual:/";
            } else if (type === "home") {
                return "";
            } else if (type === "temp") {
                return "";
            } else if (type === "appid") {
                return "";
            } else if (type === "sdcardid") {
                return "";
            }
        }
    };
    C3.Plugins.RobotKaposzta_FileManager.Instance = FileManagerRuntimeInstance;
};