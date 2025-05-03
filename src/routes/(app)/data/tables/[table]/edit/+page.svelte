<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
	} from '$lib/components/ui/card';
	import { Switch } from '$lib/components/ui/switch';
	import {
		Select,
		SelectTrigger,
		SelectContent,
		SelectItem,
	} from '$lib/components/ui/select';
	import { Separator } from '$lib/components/ui/separator';
	import { goto } from '$app/navigation';

	let { data } = $props();
	let {
		table,
		columns,
		user_facing_name,
		table_description,
		audit_logging_enabled,
	} = data;

	let userFacingName = $state(user_facing_name);
	let tableDescription = $state(table_description);
	let auditLoggingEnabled = $state(audit_logging_enabled);

	let columnList = $state(
		columns.map((col, i) => ({
			...col,
			id: col.column_name,
			index: i,
			include_in_forms: col.include_in_forms ?? true,
		})),
	);

	let selectedColumn = $state(null);

	$effect(() => {
		if (!selectedColumn && columnList.length > 0) {
			selectedColumn = columnList[0];
		}
	});

	const tallyMappingOptions = {
		text: {
			options: [
				{ value: 'INPUT_TEXT', label: 'Short Text' },
				{ value: 'TEXTAREA', label: 'Long Text' },
				{ value: 'INPUT_LINK', label: 'URL' },
				{ value: 'INPUT_PHONE_NUMBER', label: 'Phone Number' },
				{ value: 'INPUT_EMAIL', label: 'Email Address' },
			],
			extraFields: [],
		},
		integer: {
			options: [{ value: 'INPUT_NUMBER', label: 'Input Number' }],
			extraFields: [
				{ name: 'min', label: 'Minimum Value', type: 'number' },
				{ name: 'max', label: 'Maximum Value', type: 'number' },
				{ name: 'step', label: 'Step', type: 'number' },
			],
		},
		boolean: {
			options: [{ value: 'CHECKBOX', label: 'Checkbox' }],
			extraFields: [],
		},
		timestamptz: {
			options: [{ value: 'INPUT_DATE', label: 'Input Date' }],
			extraFields: [],
		},
		date: {
			options: [{ value: 'INPUT_DATE', label: 'Input Date' }],
			extraFields: [],
		},
		timestamp: {
			options: [{ value: 'INPUT_DATE', label: 'Input Date' }],
			extraFields: [],
		},
		uuid: {
			options: [{ value: 'INPUT_TEXT', label: 'Input Text' }],
			extraFields: [],
		},
	};

	let allowedMapping = $derived.by(() => {
		return (
			tallyMappingOptions[selectedColumn?.data_type] ?? {
				options: [{ value: 'INPUT_TEXT', label: 'Input Text' }],
				extraFields: [],
			}
		);
	});

	function updateExtraField(fieldName: string, value: any) {
		selectedColumn.tally_specific_options = {
			...(selectedColumn.tally_specific_options || {}),
			[fieldName]: value,
		};
	}

	function navigateBack() {
		goto('/app/data');
	}
</script>

<form method="POST">
	<div class="mb-4 flex items-center justify-between">
		<h1 class="text-2xl font-semibold">
			Edit Table Config: <code>{table}</code>
		</h1>
		<Button variant="secondary" type="button" onclick={navigateBack}
			>Back</Button
		>
	</div>

	<Card class="mb-6">
		<CardContent class="space-y-4 pt-6">
			<div>
				<label class="text-sm font-medium">User Facing Table Name</label>
				<Input bind:value={userFacingName} name="user_facing_name" />
			</div>
			<div>
				<label class="text-sm font-medium">Table Description</label>
				<Textarea bind:value={tableDescription} name="table_description" />
			</div>
			<div class="flex items-center space-x-2">
				<Switch
					bind:checked={auditLoggingEnabled}
					name="audit_logging_enabled"
				/>
				<span class="text-sm">Enable Audit Log</span>
			</div>
		</CardContent>
	</Card>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-3">
		<Card class="col-span-1">
			<CardHeader>
				<CardTitle>Columns</CardTitle>
			</CardHeader>
			<CardContent class="space-y-2">
				{#each columnList as col (col.id)}
					<div
						class="cursor-pointer rounded px-3 py-2 hover:bg-muted"
						class:selected={selectedColumn?.id === col.id}
						onclick={() => (selectedColumn = col)}
					>
						<span class="font-medium"
							>{col.user_facing_label || col.column_name}</span
						>
						<code class="ml-1 text-xs text-muted-foreground"
							>[{col.column_name}]</code
						>
					</div>
				{/each}
			</CardContent>
		</Card>

		<Card class="col-span-2">
			<CardHeader>
				<CardTitle>Edit Column: {selectedColumn?.column_name}</CardTitle>
			</CardHeader>
			<CardContent class="space-y-4">
				{#if selectedColumn}
					<Input
						type="hidden"
						name={`col_${selectedColumn.index}_column_name`}
						value={selectedColumn.column_name}
					/>

					<div>
						<label class="text-sm font-medium">User Facing Label</label>
						<Input
							name={`col_${selectedColumn.index}_user_facing_label`}
							bind:value={selectedColumn.user_facing_label}
						/>
					</div>

					<div>
						<label class="text-sm font-medium">Help Text</label>
						<Textarea
							name={`col_${selectedColumn.index}_help_text`}
							bind:value={selectedColumn.help_text}
						/>
					</div>

					<div>
						<label class="text-sm font-medium">Tally Field Type</label>
						<Select
							name={`col_${selectedColumn.index}_tally_field_type`}
							bind:value={selectedColumn.tally_field_type}
						>
							<SelectTrigger>Select a type</SelectTrigger>
							<SelectContent>
								{#each allowedMapping.options as opt}
									<SelectItem value={opt.value}>{opt.label}</SelectItem>
								{/each}
							</SelectContent>
						</Select>
					</div>

					<div class="flex items-center space-x-2">
						<Switch
							name={`col_${selectedColumn.index}_include_in_forms`}
							bind:checked={selectedColumn.include_in_forms}
						/>
						<span class="text-sm">Include in forms</span>
					</div>

					{#if allowedMapping.extraFields.length > 0}
						<Separator class="my-4" />
						<div class="space-y-2">
							{#each allowedMapping.extraFields as field}
								<div>
									<label class="text-sm font-medium">{field.label}</label>
									<Input
										type={field.type}
										value={selectedColumn.tally_specific_options?.[
											field.name
										] || ''}
										on:input={(e) =>
											updateExtraField(field.name, e.target.value)}
										id={`col_${selectedColumn.index}_${field.name}`}
										name={`col_${selectedColumn.index}_${field.name}`}
									/>
								</div>
							{/each}
						</div>
					{/if}
				{/if}
			</CardContent>
		</Card>
	</div>

	<input type="hidden" name="columnCount" value={columnList.length} />
	<input type="hidden" name="all_columns" value={JSON.stringify(columnList)} />

	<div class="mt-6 flex justify-end">
		<Button type="submit" formaction="?/updateConfig">Save Configuration</Button
		>
	</div>
</form>
