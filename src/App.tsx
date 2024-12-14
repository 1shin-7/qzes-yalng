import {
	ActionIcon,
	Autocomplete,
	Button,
	Collapse,
	Flex,
	Grid,
	Group,
	Image as MantineImage,
	NumberInput,
	Paper,
	SimpleGrid,
	Switch,
	TextInput,
	Title,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import {
	IconBrandGithubFilled,
	IconChevronDown,
	IconChevronUp,
} from "@tabler/icons-react";
import { useCallback, useEffect, useRef, useState } from "react";

import classes from "./App.module.css";
import "@mantine/dates/styles.css";
import dayjs from "dayjs";
import type { FTNAdvanced, FTNAttributes } from "./types";

function App() {
	const [advanceOpened, advanceHandler] = useDisclosure(false);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const [canvasData, setCanvasData] = useState(canvasRef.current?.toDataURL());
	const [qzesLogo, setLogo] = useState<HTMLImageElement | null>(null);

	// 如果localstorage有qzes_data的数据就读取并解析json，否则用创建一个具有默认值的FTNAttribute
	const qzesDataRaw = localStorage.getItem("qzes_data");
	const advanceRaw = localStorage.getItem("qzes_advance");

	const [qzesData, setData] = useState<FTNAttributes>(
		qzesDataRaw
			? JSON.parse(qzesDataRaw)
			: {
					name: "李华",
					cls: "1",
					dormitory: "M101",
					leaveDate: new Date(),
					backDate: new Date(),
				},
	);
	const [advanceAttr, setAdvanceData] = useState<FTNAdvanced>(
		advanceRaw
			? JSON.parse(advanceRaw)
			: {
					header: "经家长确认，班主任批准，教官备案，同意",
					extra: ["noComma"],
				},
	);

	// 仅加载图片一次
	useEffect(() => {
		const loadImage = async () => {
			try {
				const response = await fetch("/logo.jpg");
				if (!response.ok) throw new Error("Failed to fetch image");

				const blob = await response.blob();
				const img = new Image();
				img.src = URL.createObjectURL(blob);

				img.onload = () => {
					setLogo(img); // 缓存图片
				};
			} catch (error) {
				console.error("Image load error:", error);
			}
		};

		loadImage();
	}, []); // 只在组件挂载时执行一次

	const draw = useCallback(() => {
		if (canvasRef.current) {
			const ctx = canvasRef.current?.getContext("2d");
			if (ctx) {
				const w = ctx.canvas.width;
				const h = ctx.canvas.height;

				ctx.clearRect(0, 0, w, h);
				ctx.fillStyle = "#f8f9fa"; // --mantine-color-gray-0
				ctx.fillRect(0, 0, w, h);

				// 标题
				ctx.fillStyle = "#000";
				ctx.font = `bold 72px '宋体'`;
				ctx.fillText("出 行 条", w / 2 - (72 - 10) * 3, 40 + 80); // 72 - 10 is a magic idk why but it works

				// 外框
				ctx.lineWidth = 7; // 确保线条宽度在1到5之间
				ctx.strokeRect(40, 40, w - 80, h - 80);

				// Logo
				if (qzesLogo && !advanceAttr.extra.includes("noLogo")) {
					ctx.drawImage(qzesLogo, w - qzesLogo.width - 32, 64, 176, 176);
				}

				// 头部
				ctx.font = `38px '黑体'`;
				ctx.fillText(`${advanceAttr.header}：`, 48, 220);

				// 正文
				ctx.fillText(
					`班${advanceAttr.extra.includes("noComma") ? "" : "，"}`,
					268,
					328,
				);
				ctx.fillText(
					`宿舍${advanceAttr.extra.includes("noComma") ? "" : "，"}`,
					566,
					328,
				);
				ctx.fillText("同学离校", w - 38 * 4 - 47, 328); // 47 = padding(40) + strokeWidth(7)

				// 尾部
				ctx.fillText("离校时间：", 47, 424); // 424 = canvasWidth(500) - (padding(40) + strokeWidth(7)) - extraPadding(29)
				ctx.fillText("返校时间：", 528, 424);

				// 附加信息
				ctx.font = `bold 52px '宋体'`;
				ctx.fillText(`${qzesData.cls}`, 116, 338); // 班级
				ctx.fillText(`${qzesData.dormitory}`, 365, 338); // 宿舍
				ctx.fillText(`${qzesData.name}`, 712, 338); // 名字

				// 日期
				if (!advanceAttr.extra.includes("noDate")) {
					ctx.font = `bold 38px '宋体`;
					ctx.fillText(
						dayjs(qzesData.leaveDate).format("MM月D日HH：mm"),
						224,
						424,
					);
					ctx.fillText(
						dayjs(qzesData.backDate).format("MM月D日HH：mm"),
						758,
						424,
					);
				}

				setCanvasData(canvasRef.current.toDataURL());
			}
		}
	}, [qzesData, advanceAttr, qzesLogo]);

	const download = () => {
		if (canvasRef.current) {
			const link = document.createElement("a");
			link.download = `qzes_${qzesData.name}_${dayjs().format("YYYYMMDDHHmmss")}.jpg`;
			link.href = canvasRef.current.toDataURL();
			link.click();
		}
	};

	useEffect(() => {
		localStorage.setItem("qzes_data", JSON.stringify(qzesData));
		localStorage.setItem("qzes_advance", JSON.stringify(advanceAttr));
		draw();
	}, [qzesData, advanceAttr, draw]);

	useEffect(draw, []);

	return (
		<>
			<ActionIcon
				component="a"
				href="https://github.com/1shin-7/qzes-yalng"
				variant="default"
				radius="xl"
				aria-label="Github"
				size="md"
				className={classes.githubIcon}
			>
				<IconBrandGithubFilled />
			</ActionIcon>
			<div className={classes.appBox}>
				<div className={classes.appTitle}>
					<Title order={1}>QZES</Title>
				</div>
				<Paper shadow="sm" p="lg" radius="md" withBorder>
					<SimpleGrid cols={{ base: 1, sm: 2 }}>
						<Flex gap="sm" direction="column">
							<canvas
								ref={canvasRef}
								className={classes.hidden}
								width={1100}
								height={500}
							/>
							<MantineImage src={canvasData} radius="md" alt="qzes" />
							<Flex gap="sm" wrap="wrap">
								<Button
									className={classes.dlBtn}
									onClick={download}
									style={{ flexGrow: 1 }}
								>
									Download
								</Button>
								<Button
									className={classes.dlBtn}
									onClick={download}
									style={{ flexGrow: 2 }}
								>
									Download Full Page
								</Button>
							</Flex>
						</Flex>
						<div>
							<Grid columns={6}>
								<Grid.Col span={{ base: 6, xs: 2, sm: 3, md: 2 }}>
									<NumberInput
										label="班级"
										description="申请人所在的班级."
										placeholder="1"
										value={qzesData.cls}
										min={1}
										max={99}
										onChange={(e) => {
											setData({ ...qzesData, cls: e });
										}}
									/>
								</Grid.Col>
								<Grid.Col span={{ base: 6, xs: 4, sm: 3, md: 2 }}>
									<TextInput
										label="姓名"
										description="申请人的名字."
										placeholder="李华"
										value={qzesData.name}
										onChange={(e) => {
											setData({ ...qzesData, name: e.target.value });
										}}
									/>
								</Grid.Col>
								<Grid.Col
									span={{
										base: 6,
										xs: advanceAttr.extra.includes("withSign") ? 3 : 6,
										md: 2,
									}}
								>
									<TextInput
										label="宿舍"
										description="申请人所在的宿舍(区)."
										placeholder="M101"
										value={qzesData.dormitory}
										onChange={(e) => {
											setData({ ...qzesData, dormitory: e.target.value });
										}}
									/>
								</Grid.Col>
								<Grid.Col
									span={{
										base: 6,
										xs: 3,
										md: 6,
									}}
									className={
										advanceAttr.extra.includes("withSign")
											? undefined
											: classes.hidden
									}
								>
									<Autocomplete
										label="印章"
										description="选择一块印章."
										data={["骆东强", "欧阳？？"]}
									/>
								</Grid.Col>
								<Grid.Col span={{ base: 6, xs: 3 }}>
									<DateTimePicker
										label="离校时间"
										description="离开学校的时间."
										valueFormat="MM月D日HH:mm"
										value={dayjs(qzesData.leaveDate).toDate()}
										onChange={(d) => {
											setData({ ...qzesData, leaveDate: d });
										}}
									/>
								</Grid.Col>
								<Grid.Col span={{ base: 6, xs: 3 }}>
									<DateTimePicker
										label="返校时间"
										description="回到学校的时间."
										valueFormat="MM月D日HH:mm"
										value={dayjs(qzesData.backDate).toDate()}
										onChange={(d) => {
											setData({ ...qzesData, backDate: d });
										}}
									/>
								</Grid.Col>
							</Grid>
							<Grid>
								<Grid.Col>
									<Button
										onClick={advanceHandler.toggle}
										variant="transparent"
										className={classes.toggleAdvance}
									>
										高级
										{advanceOpened ? <IconChevronUp /> : <IconChevronDown />}
									</Button>
								</Grid.Col>
								<Grid.Col>
									<Collapse in={advanceOpened}>
										<Grid columns={6}>
											<Grid.Col span={6}>
												<Switch.Group
													label="样式选项"
													description="自定义样式选项."
													value={advanceAttr.extra}
													onChange={(e) =>
														setAdvanceData({ ...advanceAttr, extra: e })
													}
												>
													<Group mt="xs">
														<Switch label="不加Logo" value="noLogo" />
														<Switch label="不加逗号" value="noComma" />
														<Switch label="添加印章" value="withSign" />
														<Switch label="去除时间" value="noDate" />
													</Group>
												</Switch.Group>
											</Grid.Col>
											<Grid.Col span={6}>
												<TextInput
													label="开头"
													description="离校条开头，注意周末版本不包含逗号以及LOGO，如有需要自行删改"
													value={advanceAttr.header}
													onChange={(d) => {
														setAdvanceData({
															...advanceAttr,
															header: d.target.value,
														});
													}}
												/>
											</Grid.Col>
										</Grid>
									</Collapse>
								</Grid.Col>
							</Grid>
						</div>
					</SimpleGrid>
				</Paper>
			</div>
		</>
	);
}

export default App;