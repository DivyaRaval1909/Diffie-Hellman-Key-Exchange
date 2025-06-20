
        let keyHistory = [];
        
        function addToHistory(p, g, a, b, A, B, S) {
            const history = document.getElementById('key-history');
            const item = document.createElement('div');
            item.className = 'key-history-item';
            item.innerHTML = `
                <p><strong>Exchange #${keyHistory.length + 1}</strong></p>
                <p>Prime: ${p}, Root: ${g}</p>
                <p>Private Keys: a=${a}, b=${b}</p>
                <p>Public Keys: A=${A}, B=${B}</p>
                <p>Shared Secret: S=${S}</p>
            `;
            history.insertBefore(item, history.firstChild);
            keyHistory.push({p, g, a, b, A, B, S});
        }
        
        function updateSecurityInfo(p) {
            const primeSize = Math.log2(p).toFixed(2);
            const keySpace = Math.pow(2, primeSize).toExponential(2);
            const bruteForceTime = Math.pow(2, primeSize / 2).toExponential(2);
            
            document.getElementById('prime-size').textContent = primeSize;
            document.getElementById('key-space').textContent = keySpace;
            document.getElementById('brute-force').textContent = `${bruteForceTime} operations`;
            document.getElementById('discrete-log').textContent = `O(e^(√(${primeSize} log ${primeSize})))`;
            document.getElementById('mitm-risk').textContent = 'High (without authentication)';
            document.getElementById('forward-secrecy').textContent = 'Yes';
        }

        function updateStep(step) {
            document.querySelectorAll('.step').forEach((s, i) => {
                s.classList.toggle('active', i + 1 === step);
            });
        }

        function updateVisualization(p, g, A, B, S) {
            const numbers = [p, g, A, B, S];
            const numberBoxes = document.querySelectorAll('.number-box');
            
            numberBoxes.forEach((box, index) => {
                setTimeout(() => {
                    box.textContent = numbers[index];
                    box.classList.add('highlight');
                    setTimeout(() => box.classList.remove('highlight'), 1000);
                }, index * 1000);
            });
            
            // Update security meter
            const securityLevel = document.getElementById('security-level');
            securityLevel.style.width = '100%';
            
            // Show explanation
            const explanation = document.getElementById('explanation');
            explanation.style.display = 'block';
            explanation.innerHTML = `
                <p><strong>Security Analysis:</strong></p>
                <p>• Prime number (p) size: ${p.toString().length} digits</p>
                <p>• Key space: ${Math.pow(2, Math.log2(p))} possible values</p>
                <p>• Brute force complexity: O(2^n) where n = ${Math.log2(p).toFixed(2)}</p>
            `;
        }
        
        function startTutorial() {
            const steps = [
                "Let's understand the Diffie-Hellman key exchange process...",
                "First, Tathya and Divya agree on a prime number (p) and a primitive root (g)",
                "Each chooses a private number (a for Tathya, b for Divya)",
                "They compute their public keys using the formula: A = g^a mod p",
                "They exchange their public keys",
                "Finally, they compute the shared secret using: S = B^a mod p = A^b mod p"
            ];
            
            let currentStep = 0;
            const explanation = document.getElementById('explanation');
            
            function showNextStep() {
                if (currentStep < steps.length) {
                    explanation.style.display = 'block';
                    explanation.innerHTML = `<p>${steps[currentStep]}</p>`;
                    currentStep++;
                    setTimeout(showNextStep, 3000);
                }
            }
            
            showNextStep();
        }

        function calculateKeys() {
            let p = parseInt(document.getElementById("prime").value);
            let g = parseInt(document.getElementById("root").value);
            
            if (!p || !g || p <= 1 || g <= 1) {
                alert("Please enter valid numbers for p and g (both must be greater than 1)");
                return;
            }

            updateStep(1);
            
            let a = Math.floor(Math.random() * (p - 1)) + 1;
            let b = Math.floor(Math.random() * (p - 1)) + 1;
            
            setTimeout(() => {
                updateStep(2);
                let A = Math.pow(g, a) % p;
                let B = Math.pow(g, b) % p;
                
                document.getElementById("alice-output").innerHTML = `
                    <p><strong>Tathya's Calculations:</strong></p>
                    <p>Private Key: a = ${a}</p>
                    <p>Public Key: A = g^a mod p = ${g}^${a} mod ${p} = ${A}</p>
                    <div class="formula">A = ${g}^${a} mod ${p} = ${A}</div>
                `;
                
                document.getElementById("bob-output").innerHTML = `
                    <p><strong>Divya's Calculations:</strong></p>
                    <p>Private Key: b = ${b}</p>
                    <p>Public Key: B = g^b mod p = ${g}^${b} mod ${p} = ${B}</p>
                    <div class="formula">B = ${g}^${b} mod ${p} = ${B}</div>
                `;

                setTimeout(() => {
                    updateStep(3);
                    let sharedKeyA = Math.pow(B, a) % p;
                    let sharedKeyB = Math.pow(A, b) % p;

                    setTimeout(() => {
                        updateStep(4);
                        document.getElementById("common-output").innerHTML = `
                            <p><strong>Common Calculation:</strong></p>
                            <p>Shared Secret Key: <span class="key-symbol">🔑</span> S = B^a mod p = A^b mod p = ${sharedKeyA}</p>
                            <div class="formula">S = ${B}^${a} mod ${p} = ${A}^${b} mod ${p} = ${sharedKeyA}</div>
                        `;
                        
                        document.getElementById("attacker-section").classList.remove("hidden");
                        
                        // Update security information
                        updateSecurityInfo(p);
                        
                        // Add to history
                        addToHistory(p, g, a, b, A, B, sharedKeyA);
                        
                        // Update visualization
                        updateVisualization(p, g, A, B, sharedKeyA);
                    }, 1000);
                }, 1000);
            }, 1000);
        }
   