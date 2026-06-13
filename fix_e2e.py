import re; code=open('tests/e2e_test.js').read(); code=re.sub(r'if \(btn\.closest\(\'\.nav-link\'\).*?return true;\s*\}', '', code, flags=re.DOTALL); open('tests/e2e_test_fixed.js', 'w').write(code);
