import {ReactPlayer} from "./core";
import {QualityConfig} from "@/types";

function App() {
	const defaultQualityList: QualityConfig = {
		currentKey: 3,
		qualityList: [
			{
				key: 2,
				enName: "480p",
				zhName: "标清",
				url: 'https://gs-files.oss-cn-hongkong.aliyuncs.com/okr/prod/file/2021/08/31/540p.mp4',
			},
			{
				key: 3,
				enName: "720p",
				zhName: "准高清",
				url: "https://vjs.zencdn.net/v/oceans.mp4",
			},
			{
				key: 4,
				enName: "1080p",
				zhName: "高清",
				url: 'https://gs-files.oss-cn-hongkong.aliyuncs.com/okr/test/file/2021/07/01/haiwang.mp4'
			},
			{
				key: 5,
				enName: "4k",
				zhName: "超高清",
				url: 'https://gs-files.oss-cn-hongkong.aliyuncs.com/okr/test/file/2021/07/01/haiwang.mp4'
			}
		]
	}
	return (
		<>
			<div>
				<ReactPlayer
					option={{
						qualityConfig: defaultQualityList,
						// videoSrc: "https://vjs.zencdn.net/v/oceans.mp4",
						videoSrc: 'https://gs-files.oss-cn-hongkong.aliyuncs.com/okr/test/file/2021/07/01/haiwang.mp4',
						// poster: 'https://via.placeholder.com/600x400.png?text=Poster+Image',
						language: 'en',
						isShowSet: true,
						width: 1000,
						height: 800,
						crossOrigin: 'anonymous'
					}}
				/>
			</div>
		</>
	)
}

export default App
