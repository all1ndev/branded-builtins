// Fails when an augmented overload group ends in a signature that takes narrower parameters than the
// original's last one. TypeScript reads that last signature when a function is passed as a value or
// reflected with ReturnType or Parameters, so the original has to be restated after the branded ones.
import ts from "typescript5";

const projects = [
	"test/tsconfig.json",
	"test/tsconfig.node24.json",
	"test/tsconfig.node22.json",
	"test/dom/tsconfig.json",
	"test/es2024/tsconfig.json",
];
const isSignature = (node) =>
	ts.isFunctionDeclaration(node) ||
	ts.isMethodSignature(node) ||
	ts.isMethodDeclaration(node) ||
	ts.isCallSignatureDeclaration(node);
let failures = 0;

for (const project of projects) {
	const config = ts.getParsedCommandLineOfConfigFile(
		project,
		{},
		{ ...ts.sys, onUnRecoverableConfigFileDiagnostic() {} },
	);
	const program = ts.createProgram({ rootNames: config.fileNames, options: config.options });
	const checker = program.getTypeChecker();
	const isOurs = (node) => node.getSourceFile().fileName.includes("/dist/");
	const sameParameters = (a, b) => {
		const [sa, sb] = [a, b].map((d) => checker.getSignatureFromDeclaration(d));
		if (sb.thisParameter) return true; // a restated catch-all
		if (sa.parameters.length !== sb.parameters.length) return false;
		return sa.parameters.every((pa, i) => {
			const pb = sb.parameters[i];
			const [da, db] = [pa.valueDeclaration, pb.valueDeclaration];
			if (!!da.questionToken !== !!db.questionToken || !!da.dotDotDotToken !== !!db.dotDotDotToken) return false;
			const [ta, tb] = [checker.getTypeOfSymbolAtLocation(pa, a), checker.getTypeOfSymbolAtLocation(pb, b)];
			// Type parameters of different declarations only compare equal as text.
			if (checker.typeToString(ta) === checker.typeToString(tb)) return true;
			return checker.isTypeAssignableTo(ta, tb) && checker.isTypeAssignableTo(tb, ta);
		});
	};
	const seen = new Set();
	const visit = (node) => {
		if (isSignature(node) && isOurs(node)) {
			const call = ts.isCallSignatureDeclaration(node);
			const symbol = checker.getSymbolAtLocation(call ? node.parent.name : node.name);
			if (symbol && !seen.has(symbol)) {
				seen.add(symbol);
				const declarations = call
					? symbol.declarations.flatMap((d) => (d.members ?? []).filter(ts.isCallSignatureDeclaration))
					: symbol.declarations.filter(isSignature);
				const original = declarations.filter((d) => !isOurs(d)).at(-1);
				const last = declarations.filter(isOurs).at(-1);
				if (original && !sameParameters(original, last)) {
					failures++;
					console.error(
						`${project}: restate the original last signature of ${checker.getFullyQualifiedName(symbol)}`,
					);
				}
			}
		}
		ts.forEachChild(node, visit);
	};
	for (const file of program.getSourceFiles()) if (isOurs(file)) visit(file);
}
process.exitCode = failures ? 1 : 0;
