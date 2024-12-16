import {
	Button,
	Grid,
	Paper,
	Table,
	type TableData,
	TypographyStylesProvider,
} from "@mantine/core";
import type { FTNAdvanced, FTNAttributes } from "../types";

import classes from "./Annoucement.module.css";

interface AnnoucementProps {
	setData: React.Dispatch<React.SetStateAction<FTNAttributes>>;
	setExtra: React.Dispatch<React.SetStateAction<FTNAdvanced>>;
}

const Annoucement: React.FC<AnnoucementProps> = ({ setData, setExtra }) => {
	const tableData: TableData = {
		head: [
			"差异",
			<Button
				key="daily"
				title="点击应用配置"
				onClick={() => {
					setExtra((prev) => {
						return {
							...prev,
							extra: ["noLogo", "withSign", "noDate"],
						};
					});
					setData((prev) => {
						return { ...prev, cls: "", name: "", dormitory: "" };
					});
				}}
			>
				日常版
			</Button>,
			<Button
				key="weekly"
				title="点击应用配置"
				onClick={() =>
					setExtra((prev) => {
						return {
							...prev,
							header: prev.header.replace(/[,，]/g, ""),
							extra: ["noSign", "noComma"],
						};
					})
				}
			>
				周末版
			</Button>,
		],
		body: [
			["Logo", "❌", "✅"],
			["印章", "✅", "❌"],
			["逗号", "✅", "❌"],
			["时间", "❌", "✅"],
			["纸张背景", "白色", "随机"],
		],
	};

	return (
		<Grid columns={12}>
			<Grid.Col span={{ base: 12, md: 6, xl: 5 }}>
				<Paper shadow="sm" p="lg" radius="md" withBorder>
					<TypographyStylesProvider>
						<p>
							<strong>
								<a href="https://github.com/1shin-7/qzes-yalng/issues/1">
									[Bug]
								</a>{" "}
								非Windows设备生成的字体与原版相差较大，待解决。
							</strong>
						</p>
						<p>
							<h3>指南</h3>
							<strong>
								出行条共分为两个版本。其中，日常版具备印章，而周末版本则为校徽;二者在逗号、logo等细微处亦有差别.
							</strong>
						</p>
						<div className={classes.cmpTable}>
							<Table data={tableData} />
						</div>
					</TypographyStylesProvider>
				</Paper>
			</Grid.Col>
		</Grid>
	);
};

export default Annoucement;
