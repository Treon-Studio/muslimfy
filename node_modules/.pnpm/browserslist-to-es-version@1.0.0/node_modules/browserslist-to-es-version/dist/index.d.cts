type ESVersion = 5 | 2015 | 2016 | 2017 | 2018;
declare function browserslistToESVersion(browsers: string[]): ESVersion;

export { type ESVersion, browserslistToESVersion };
