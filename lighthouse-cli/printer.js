/**
 * @license Copyright 2016 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * An enumeration of acceptable output modes:
 *   'json': JSON formatted results
 *   'html': An HTML report
 *   'domhtml': Alias for 'html' report
 */
var OutputMode;
(function (OutputMode) {
    OutputMode[OutputMode["json"] = 0] = "json";
    OutputMode[OutputMode["html"] = 1] = "html";
    OutputMode[OutputMode["domhtml"] = 2] = "domhtml";
})(OutputMode || (OutputMode = {}));
exports.OutputMode = OutputMode;
;
const fs = require('fs');
const ReportGeneratorV2 = require('../lighthouse-core/report/v2/report-generator');
const log = require('lighthouse-logger');
/**
 * Verify output path to use, either stdout or a file path.
 */
function checkOutputPath(path) {
    if (!path) {
        log.warn('Printer', 'No output path set; using stdout');
        return 'stdout';
    }
    return path;
}
exports.checkOutputPath = checkOutputPath;
/**
 * Creates the results output in a format based on the `mode`.
 */
function createOutput(results, outputMode) {
    // HTML report.
    if (outputMode === OutputMode.domhtml || outputMode === OutputMode.html) {
        return new ReportGeneratorV2().generateReportHtml(results);
    }
    // JSON report.
    if (outputMode === OutputMode.json) {
        return JSON.stringify(results, null, 2);
    }
    throw new Error('Invalid output mode: ' + outputMode);
}
exports.createOutput = createOutput;
/* istanbul ignore next */
/**
 * Writes the output to stdout.
 */
function writeToStdout(output) {
    return new Promise(resolve => {
        // small delay to avoid race with debug() logs
        setTimeout(_ => {
            process.stdout.write(`${output}\n`);
            resolve();
        }, 50);
    });
}
/**
 * Writes the output to a file.
 */
function writeFile(filePath, output, outputMode) {
    return new Promise((resolve, reject) => {
        // TODO: make this mkdir to the filePath.
        fs.writeFile(filePath, output, 'utf8', (err) => {
            if (err) {
                return reject(err);
            }
            log.log('Printer', `${OutputMode[outputMode]} output written to ${filePath}`);
            resolve();
        });
    });
}
/**
 * Writes the results.
 */
function write(results, mode, path) {
    return new Promise((resolve, reject) => {
        const outputPath = checkOutputPath(path);
        const output = createOutput(results, OutputMode[mode]);
        // Testing stdout is out of scope, and doesn't really achieve much besides testing Node,
        // so we will skip this chunk of the code.
        /* istanbul ignore if */
        if (outputPath === 'stdout') {
            return writeToStdout(output).then(_ => resolve(results));
        }
        return writeFile(outputPath, output, OutputMode[mode])
            .then(_ => {
            resolve(results);
        })
            .catch(err => reject(err));
    });
}
exports.write = write;
function GetValidOutputOptions() {
    return [
        OutputMode[OutputMode.json], OutputMode[OutputMode.html],
        OutputMode[OutputMode.domhtml]
    ];
}
exports.GetValidOutputOptions = GetValidOutputOptions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpbnRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInByaW50ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7R0FJRztBQUNILFlBQVksQ0FBQzs7QUFFYjs7Ozs7R0FLRztBQUNILElBQUssVUFJSjtBQUpELFdBQUssVUFBVTtJQUNiLDJDQUFJLENBQUE7SUFDSiwyQ0FBSSxDQUFBO0lBQ0osaURBQU8sQ0FBQTtBQUNULENBQUMsRUFKSSxVQUFVLEtBQVYsVUFBVSxRQUlkO0FBeUdDLGdDQUFVO0FBeEdaLENBQUM7QUFLRCxNQUFNLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDekIsTUFBTSxpQkFBaUIsR0FBRyxPQUFPLENBQUMsK0NBQStDLENBQUMsQ0FBQztBQUNuRixNQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUd6Qzs7R0FFRztBQUNILHlCQUF5QixJQUFZO0lBQ25DLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNWLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGtDQUFrQyxDQUFDLENBQUM7UUFDeEQsTUFBTSxDQUFDLFFBQVEsQ0FBQztJQUNsQixDQUFDO0lBRUQsTUFBTSxDQUFDLElBQUksQ0FBQztBQUNkLENBQUM7QUFpRkMsMENBQWU7QUEvRWpCOztHQUVHO0FBQ0gsc0JBQXNCLE9BQWdCLEVBQUUsVUFBc0I7SUFDNUQsZUFBZTtJQUNmLEVBQUUsQ0FBQyxDQUFDLFVBQVUsS0FBSyxVQUFVLENBQUMsT0FBTyxJQUFJLFVBQVUsS0FBSyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUN4RSxNQUFNLENBQUMsSUFBSSxpQkFBaUIsRUFBRSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFFRCxlQUFlO0lBQ2YsRUFBRSxDQUFDLENBQUMsVUFBVSxLQUFLLFVBQVUsQ0FBQyxJ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